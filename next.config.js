/** @type {import('next').NextConfig} */
const nextConfig = {
  // Modify Webpack only if necessary
  webpack: (config, { isServer }) => {
    if (isServer) {
      return config;
    }

    // Example of modifying Webpack config
    config.stats = 'verbose'; // Reduce Webpack logs (optional)
    return config;
  },

  // Rewrite API requests to a different backend server
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'http://localhost:5000/api/:path*', // Proxy to backend
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
