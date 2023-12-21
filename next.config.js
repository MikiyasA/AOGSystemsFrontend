/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true
    }
    return config
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: '/media/:path*',
  //       destination: 'http://127.0.0.1:8000/media/:path*',
  //     },
  //   ];
  // },
}

module.exports = nextConfig

