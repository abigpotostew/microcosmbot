module.exports = {
  reactStrictMode: true,
  transpilePackages: ["@nouns-stream/ui"],
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: { and: [/\.(js|ts|md)x?$/] },
      use: ['@svgr/webpack'],
    });
    return config;
  },
};
