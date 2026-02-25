import path from 'path'
import { fileURLToPath } from 'url'
import createNextIntlPlugin from 'next-intl/plugin'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
    unoptimized: false,
  },
  // Next 16: turbopack is top-level (next-intl still sets experimental.turbo)
  turbopack: {
    root: __dirname,
  },
}

let config = withNextIntl(nextConfig)

// Next 16: apply next-intl's alias under top-level turbopack (next-intl still sets experimental.turbo)
if (config.experimental?.turbo?.resolveAlias) {
  const { turbo, ...restExperimental } = config.experimental
  config = {
    ...config,
    turbopack: {
      ...config.turbopack,
      resolveAlias: {
        ...config.turbopack?.resolveAlias,
        ...turbo?.resolveAlias,
      },
    },
    experimental: restExperimental,
  }
}

export default config
