const withImages = require('next-images');

nextConfig = {
    env: {
        NEAR_ENV: process.env.NEAR_ENV
    }
}

module.exports = withImages(nextConfig);
