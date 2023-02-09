// Use this code snippet in your app.
// If you need more information about configurations or implementing the sample code, visit the AWS docs:
// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started.html

import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

async function secretKeys() {
  const secret_name = 'playible-game-image/key';

  const client = new SecretsManagerClient({
    region: 'ap-southeast-1',
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
    throw error;
  }
  const secret = response.SecretString;

  const s3Config = {
    bucketName: 'playible-game-image',
    region: 'ap-southeast-1',
    accessKeyId: secret.API_S3_KEY,
    secretAccessKey: secret.SECRET_S3_KEY,
  };

  return await s3Config;
}
// Your code goes here

export default secretKeys;
