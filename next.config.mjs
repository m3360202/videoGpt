/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['knex', 'sutando'],
  },
};

export default nextConfig;
