/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '/broz' : '',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig