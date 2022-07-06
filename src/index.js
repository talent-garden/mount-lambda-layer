import core from '@actions/core';
import github from '@actions/github';
import { HttpClient } from '@actions/http-client';
import { LambdaClient, GetLayerVersionByArnCommand } from "@aws-sdk/client-lambda"; // ES Modules import

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
    const command = new GetLayerVersionByArnCommand({ Arn: 'arn:aws:lambda:eu-west-1:419773206330:layer:ag-stag-node-modules:2' });
    const response = await client.send(command);
    const httpClient = new HttpClient();
    const file = await httpClient.get(response.Content.Location)
    console.log(file);
    const packageFile = await fs.readFile(path, 'utf8')
    console.log(packageFile);


    re.setOutput("file", file);


    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
