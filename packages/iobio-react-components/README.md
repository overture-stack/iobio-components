# Overture Wrapper for Bam.Iobio Components

## Setup + Local Development

### Requirements:

- PNPM 9+
- Node 20+

- Install dependencies: `pnpm i`

- Import components in consumer app as `import { IobioDataBroker } from '@overture-stack/iobio-components/packages/iobio-react-components/;`

### Build Package

- `pnpm run build`

## React Components

- This package exports a set of React + TypeScript components to facilitate the integration of the Iobio Charts library of "web components" into your UI app.

- The Demo App at `iobio-components/apps/bam.iobio` shows an example integration which closely mirrors the integration at bam.iobio.io

- The `<IobioDataBroker />` component is necessary to analyze a given file. It receives an `alignmentUrl` string prop which should point to a BAM/CRAM file URL. The Iobio server performs an analysis on the given file, and streams data back to the Data Broker web component. The other Iobio web components read from the Data Broker and render updates appropriately.

- Some visualization components (`histogram` and `percentBox`) require data keys that correspond to this analysis to know what data to read. These values can be found in `/utils/constants`

- The Overture `Iobio React Components` library also adds basic TypeScript definitions in iobio.d.ts; complementing the `iobio-charts` library, which is not "typed".

### SSR Integrations

- Integrations with Overture Stage revealed conflicts between web component usage in `iobio-charts` and Next.js server side rendering, which may be an issue in future projects. Iobio Charts uses a DOM API that is not available when rendered on the server, and which create conflicts when rendered multiple times.

- This API is used by (but not limited to) `customElements`, `HTMLElement`, `Element` and `CssStyleSheet`.

- The Stage solution is to leverage `JSDOM` and add DOM shims to handle the server side code. `Iobio React Components` also exports an IIFE async import to enforce asynchronous imports.

- example: 

```
// next.config.js
module.exports = withPlugins([withTranspileModules], {
	webpack: (config, options) => {
		if (options.isServer) {
			const { JSDOM } = jsdom;
			const dom = new JSDOM('', { url: 'http://localhost/' });
      global.customElements = global.window.customElements;
```

- This solution works in Next 12.1 and may be updated in future iterations.

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
