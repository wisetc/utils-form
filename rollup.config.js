import typescript from 'rollup-plugin-typescript2';

const tsconfigDefaults = { compilerOptions: { declaration: true } };
const tsconfigOverride = { compilerOptions: { module: 'esnext' } };

function getName(filePath) {
  return filePath.replace(/^(.*\/)?(.+)\..+$/, (s0, s1, s2) => s2);
}

function createConfig(opts) {
  const outDir = 'lib';
  return {
    input: opts.input,

    plugins: [
      typescript({
        tsconfigDefaults,
        tsconfig: opts.tsconfig,
        tsconfigOverride,
      }),
    ],
    output: {
      format: opts.format,
      file: `${outDir}/${getName(opts.input)}.${opts.format}.js`,
    },
  };
}

export default [
  ...['esm', 'cjs'].map((format) =>
    createConfig({
      input: 'src/index.ts',
      format,
      tsconfig: 'tsconfig.json',
    })
  ),
  ...['esm', 'cjs'].map((format) =>
    createConfig({
      input: 'src/oss.ts',
      format,
      tsconfig: 'tsconfig.json',
    })
  ),
];
