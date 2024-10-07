# Overture Iobio Components

A set of reusable React components and command line tools for integrating the visualization and analysis software originally created by [IOBIO](https://iobio.io/).

</br>

> 
> <div>
> <img align="left" src="ov-logo.png" height="50"/>
> </div>
> 
> *Overture Iobio Components is part of [Overture](https://www.overture.bio/), a collection of open-source software microservices used to create platforms for researchers to organize and share genomics data. See our [related products](#related-products) for more information on how Overture is helping organize data and enable discovery.*
> 
> 

## Repository Structure

The repository is organized with the following directory structure:

```
.
├── apps/
│   └── bam.iobio 
└── packages/
    └── iobio-react-components
        ├── components 
        └── utils
```

The modules in the monorepo are organized into two categories:

- __apps/__ - Demo integration example applications.
- __packages/__ - Reusable packages shared between applications and other packages. Packages are published to [NPM](https://npmjs.com).

## Local development

### Development tools

- [PNPM](https://pnpm.io/) This project is a monorepo managed by PNPM
- [Node.js](https://nodejs.org/en) Runtime environment (v20 or higher)
- [VS Code](https://code.visualstudio.com/) As recommended code editor. Plugins recommended: ESLint, Prettier - Code formatter, Mocha Test Explorer, Monorepo Workspace

### Setup

1. Install the dependencies

```shell
  npm i pnpm -g
  pnpm i
```
2. Run Demo App

```shell 
  cd apps/bam.iobio
  pnpm run dev
```

## Support & Contributions

- Filing an [issue](https://github.com/overture-stack/iobio-components/issues)
- Making a [contribution](https://github.com/overture-stack/.github/blob/master/CONTRIBUTING.md)
- Connect with us on [Slack](http://slack.overture.bio)

## <a name="related-products"></a>Related Software

The Overture Platform includes the following Overture Components:

</br>

|Software|Description|
|---|---|
|[Score](https://github.com/overture-stack/score/)| Transfer data to and from any cloud-based storage system |
|[Song](https://github.com/overture-stack/song/)| Catalog and manage metadata associated to file data spread across cloud storage systems |
|[Maestro](https://github.com/overture-stack/maestro/)| Organizing your distributed data into a centralized Elasticsearch index |
|[Arranger](https://github.com/overture-stack/arranger/)| A search API with reusable search UI components |
|[Stage](https://github.com/overture-stack/stage)| A React-based front-data portal UI |
|[Lyric](https://github.com/overture-stack/lyric)| A data-agnostic tabular data submission system |
|[Lectern](https://github.com/overture-stack/lectern)| A simple web browser UI that integrates Ego and Arranger |

## Acknowledgements

Overture is supported by grant #U24CA253529 from the National Cancer Institute at the US National Institutes of Health.
