/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'd3wo5wojvuv7l.cloudfront.net',
          port: '',
          pathname: '/**', 
        },
        {
          protocol: 'https',
          hostname: 'd1sfpqaoey1aeo.cloudfront.net',
          port: '',
          pathname: '/**', 
        },
      ],
    },
  };
  
  module.exports = nextConfig;