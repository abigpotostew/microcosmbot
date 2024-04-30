import { defineConfig, Options } from 'tsup'

export default defineConfig((options: Options) => ({
  treeshake: false,
  splitting: false,
  entry: ['src/**/*.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  minify: true,
  clean: true,
  sourcemap: false,
  target: 'es2020',
  // skipNodeModulesBundle: false,
  noExternal: ['grammy'],
  bundle: true,
  ...options,
}))
