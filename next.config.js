/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove the swcMinify line if it's there
  eslint: {
    // Disable specific rules that are causing build failures
    ignoreDuringBuilds: false,
    dirs: ['pages', 'components', 'lib', 'hooks'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude service worker from server-side bundling
      config.resolve.alias = {
        ...config.resolve.alias,
        'sw.js': false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
