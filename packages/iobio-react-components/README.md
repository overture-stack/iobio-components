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

- Iobio Components currently only supports client-side rendering. The 'iobio-charts' web components rely on DOM APIs including `customElements`, `HTMLElement`, `Element` and `CssStyleSheet`.

- A solution currently used in Overture Stage is to leverage `JSDOM` and add DOM shims to handle the server side code. `Iobio React Components` also exports an IIFE async import to enforce asynchronous imports.

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

## Node Iobio Metadata Utilities

These features rely on Node web streams, and use of Node v22 is enforced in package.json engines field and .npmrc.

### ElasticSearch Index Updater Utility

A command line script for updating an ElasticSearch document with metadata generated using the Iobio tools. ElasticSearch Index field mappings are updated as needed. This function is built for Overture Score-based file systems. This script executes the Statistics Generation script and allows for outputting the metadata result as JSON.

- Usage: `pnpm run indexer`

Arguments:
- `index` ElasticSearch index containing target file
- `documentId` Elastic document Id to update with statistics

Env Config: 
- `SCORE_API_URL` Score File server URL for retrieving BAM files
- `ES_AUTH_KEY` ElasticSearch Authorization header string
- `ES_HOST_URL` ElasticSearch instance url

### Statistics Generation

This package provides a command line script for obtaining BAM File statistics by querying the Iobio server. Provide a BAM/CRAM file URL to obtain mean read coverage and other statistics on sampled regions of the file. Values will vary depending on the number of reads performed and regions sampled. An Index File URL can be provided for more accurate results. This function allows for outputting the metadata result as JSON.

- Usage: `pnpm run stats`

Arguments: 
- `alignmentUrl` Source URL for BAM or CRAM file to read and generate statistics
- `indexUrl` Optional, associated index file url to improve BAM/CRAM file read accuracy

Env Config:
- `IOBIO_SERVER_URL` Optional, allows for running a local instance of an Iobio server

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
