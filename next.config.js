/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development
  reactStrictMode: true,
  
  // Disable x-powered-by header for security
  poweredByHeader: false,
  
  // Configure image domains if you're using next/image
  images: {
    domains: [], // Add any external image domains here
    unoptimized: false,
  },
  
  // Ensure trailing slashes are handled consistently
  trailingSlash: false,
  
  // Compress responses
  compress: true,
};

module.exports = nextConfig;