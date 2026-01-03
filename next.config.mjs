import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@payloadcms/ui', '@payloadcms/richtext-lexical'],
    optimizeServerReact: true,
  },
  // Налаштування попереднього завантаження
  onDemandEntries: {
    // Максимальний час утримання сторінки в пам'яті
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 1,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  poweredByHeader: false,
  webpack: (webpackConfig, { isServer }) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    // Виключаємо Node.js модулі з клієнтського bundle
    if (!isServer) {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        worker_threads: false,
        'pino-abstract-transport': false,
        stream: false,
        util: false,
      }
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
