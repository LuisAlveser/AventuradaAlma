import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental:{
   globalNotFound:true
  },
  /* config options here */
  images:{
    remotePatterns:[
     {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ]
  }
};

export default nextConfig;
