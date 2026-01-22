import terser from '@rollup/plugin-terser';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

const banner = `/**
 * simple-event-handler v${pkg.version}
 * (c) ${new Date().getFullYear()} Volodymyr Lavrynovych
 * @license MIT
 */`;

export default [
  // UMD build (unminified)
  {
    input: 'src/simple-event-handler.js',
    output: {
      file: 'dist/simple-event-handler.js',
      format: 'umd',
      name: 'EventHandler',
      banner,
      sourcemap: true,
      exports: 'auto'
    }
  },
  // UMD build (minified)
  {
    input: 'src/simple-event-handler.js',
    output: {
      file: 'dist/simple-event-handler.min.js',
      format: 'umd',
      name: 'EventHandler',
      banner,
      sourcemap: true,
      exports: 'auto',
      plugins: [terser({
        format: {
          comments: /^!/
        }
      })]
    }
  },
  // ES Module build
  {
    input: 'src/simple-event-handler.js',
    output: {
      file: 'dist/simple-event-handler.esm.js',
      format: 'es',
      banner,
      sourcemap: true
    }
  }
];
