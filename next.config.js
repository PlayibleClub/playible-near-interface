const withImages = require('next-images');

nextConfig = {
  images: {
    domains: [
      'playible-api-production.s3.ap-southeast-1.amazonaws.com',
      'playible-game-image.s3-ap-southeast-1.amazonaws.com',
      'playible-game-image.s3.ap-southeast-1.amazonaws.com',
      'playible-api-dev.s3.ap-southeast-1.amazonaws.com',
      's3-us-west-2.amazonaws.com',
    ],
  },
  env: {
    NEAR_ENV: process.env.NEAR_ENV,
    GRAPHQL_URL: process.env.GRAPHQL_URL,
    ADMIN: process.env.ADMIN,
    ADMIN2: process.env.ADMIN2,
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
    TEST_SECRET_KEY: process.env.TEST_SECRET_KEY,
  },
};

module.exports = withImages(nextConfig);
