import core from '@actions/core';
import fs from 'fs';
import unzip from 'unzipper';
import axios from 'axios';
import { LambdaClient, GetLayerVersionByArnCommand } from "@aws-sdk/client-lambda"; // ES Modules import

const getPackageJsonContent = async (stream) => {
  let fileContent;
  const promise = new Promise((resolve, reject) => {
    stream.pipe(unzip.Parse())
      .on('entry', async (entry) => {
        const filePath = entry.path;
        if (filePath === 'nodejs/package.json') {
          const fileContentString = await entry.buffer().then(buffer => buffer.toString());
          fileContent = JSON.parse(fileContentString);
        } else {
          entry.autodrain();
        }
      }).on('close', () => {
        resolve(fileContent)
      });
  });
  return promise;
}

export default async function run() {
  try {
    console.log('INIT');
    const arn = core.getInput('arn');
    const data = arn.split(':');
    const region = data[3];
    const layerName = data[6];
    const layerVersion = data[7];
    console.log(`Layer ${layerName}!`);

    const client = new LambdaClient({ region });
    const command = new GetLayerVersionByArnCommand({ Arn: arn });
    const response = await client.send(command);
    console.log(response.Content.Location);
    const res = await axios({
      method: 'get',
      url: response.Content.Location,
      responseType: 'stream'
    });
    const packageLayer = await getPackageJsonContent(res.data);
    const packageRepo = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    console.log('Repository depencies', packageRepo.dependencies);
    console.log('Layer depencies', packageLayer.dependencies);
    packageRepo.dependencies = packageLayer.dependencies;
    console.log('Overrideed Repository depencies', packageRepo.dependencies);
    fs.writeFileSync('./package.json', JSON.stringify(packageRepo, null, 2));
  } catch (error) {
    core.setFailed(error);
  }
}

run();
