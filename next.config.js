const withImages = require('next-images');

nextConfig = {
    images: {
        domains: ["playible-api-production.s3.ap-southeast-1.amazonaws.com"]
    },
    env: {
        NEAR_ENV: process.env.NEAR_ENV,
        GRAPHQL_URL: process.env.GRAPHQL_URL
    }
}

module.exports = withImages(nextConfig);
