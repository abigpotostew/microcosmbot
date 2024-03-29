const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  transpilePackages: ['@microcosmbot/ui', '@microcosms/bot', '@microcosms/db'],
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: { and: [/\.(js|ts|md)x?$/] },
      use: ['@svgr/webpack'],
    })
    return config
  },
  redirects() {
    return [
      process.env.MAINTENANCE_MODE === '1'
        ? {
            source: '/((?!maintenance).*)',
            destination: '/maintenance',
            permanent: false,
          }
        : null,
    ].filter(Boolean)
  },
})
