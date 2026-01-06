/** @type {import('next').NextConfig} */
const nextConfig = {
     images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        // Optional: set a specific pathname if all images are in a certain folder
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
