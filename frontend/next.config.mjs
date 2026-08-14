/** @type {import('next').NextConfig} */
const strapi = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const { hostname, protocol, port } = new URL(strapi);

export default {
  images: {
    remotePatterns: [
      { protocol: protocol.replace(':', ''), hostname, port: port || '' }
    ]
  }
};
