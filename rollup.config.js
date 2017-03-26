import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

let pkg = require('./package.json');
let external = Object.keys(pkg.dependencies);

export default {
  entry: 'index.js',
  format: 'umd',
  globals: {
    d3: 'd3',
    redux: 'Redux' // ,
    // lodash: '_',
    // 'bootstrap.native': 'bsn' 
  },
  moduleName: 'd3ComponentScatterplot',
  plugins: [
    nodeResolve({ jsnext: true, main: true }),
    json(),
    babel(),
    commonjs()
  ],
  external: external,
  dest: 'build/bundle.js',
  acorn: {
    allowReserved: true
  }
};