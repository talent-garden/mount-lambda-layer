# Mount Lambda Layer

You can use this GitHub Action to override nodejs repository dependencies with lambda layer dependecies. 
The action will:
- downloads the zip file of the lambda layer
- unzips the files to find the `package.json` file
- overrides the dependecy key in the `package.json` with the one in the package.json of the layer.

## Table of contents
- [Requirements](#requirements)
- [Inputs](#inputs)
- [Outputs](#outputs)

## Requirements

This action requires that you have configured your enviroment with the AWS creadentials. \
You can easly do it using this action [aws-actions/configure-aws-credentials@v1](https://github.com/aws-actions/configure-aws-credentials)


## Inputs

Add a step like this to your workflow:

```yaml
- uses: talent-garden/mount-lambda-layer@v1.0.0 # You can change this to use a specific version.
  with:
    # The ARN of a specific lambda layer version
    # Required: true
    arn: arn:aws:lambda:eu-west-1:1122334455:layer:my-super-layer:8
```

## Outputs

This action doesn't provide any output since it overrides the local `package.json` file
