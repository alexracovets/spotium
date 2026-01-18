import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@payloadcms/ui', '@payloadcms/richtext-lexical'],
    optimizeServerReact: true,
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
