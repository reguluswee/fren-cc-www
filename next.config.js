/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config");

const nextConfig = {
  i18n,
  reactStrictMode: true,
  trailingSlash: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: false,
      },
      {
        source: "/mint",
        destination: "/mint/1",
        permanent: false,
      },
      {
        source: "/stake",
        destination: "/stake/1",
        permanent: false,
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: '/txbit/:path*',
        destination: 'https://api.txbit.io/api/:path*',
      },
    ]
  },
};

module.exports = nextConfig;
