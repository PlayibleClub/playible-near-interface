// Use this code snippet in your app.
// If you need more information about configurations or implementing the sample code, visit the AWS docs:
// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started.html

import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

async function secretKeys() {
  const secret_name = 'playible-game-image/key';

  const credentials = {};

  const client = new SecretsManagerClient({
    region: 'ap-southeast-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    },
  });

  let response;

  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: 'AWSCURRENT', // VersionStage defaults to AWSCURRENT if unspecified
      })
    );
  } catch (error) {
    // For a list of exceptions thrown, see
    // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    console.log(error);
    throw error;
  }
  const secret = JSON.parse(response.SecretString);

  const s3Config = {
    bucketName: 'playible-game-image',
    region: 'ap-southeast-1',
    accessKeyId: secret.API_S3_KEY,
    secretAccessKey: secret.SECRET_S3_KEY,
  };

  return s3Config;
}
// Your code goes here

export default secretKeys;
