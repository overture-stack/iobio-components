# Overture Wrapper for Bam.Iobio Components

## Setup + Local Development

- Install dependencies: `pnpm i`

- Import components in consumer app as `import IobioComponents from '@overture-stack/iobio-components/components/src/index';`

## React Components

- Stub for React Component documentation.
<!-- TODO: Write Docs (include pnpm, monorepo, etc) -->

## Statistics Generation

- This package provides a command line utility function for obtaining BAM File statistics by querying the Iobio server. Provide a BAM/CRAM file URL to obtain mean read coverage and other statistics on sampled regions of the file. Values will vary depending on the number of reads performed and regions sampled.

- Usage: `pnpm run stats ${url}`

- This feature relies on Node web streams, and use of Node v22 is enforced in package.json engines field and .npmrc.


## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
