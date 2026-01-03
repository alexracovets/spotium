import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  experimental: {
    // Оптимізація попереднього завантаження CSS
    optimizePackageImports: ['@payloadcms/ui', '@payloadcms/richtext-lexical'],
    // Оптимізація CSS для локалізованих маршрутів
    optimizeCss: true,
    // Оптимізація попереднього завантаження - завантажувати тільки поточну локаль
    optimizeServerReact: true,
    // Вимкнути автоматичне попереднє завантаження для невикористовуваних локалей
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
  // Налаштування попереднього завантаження
  onDemandEntries: {
    // Максимальний час утримання сторінки в пам'яті
    maxInactiveAge: 25 * 1000,
    // Кількість одночасних сторінок - зменшено для оптимізації
    pagesBufferLength: 1,
  },
  // Налаштування компіляції
  compiler: {
    // Видаляє console.log в production
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  // Налаштування для вимкнення автоматичного попереднього завантаження CSS
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
