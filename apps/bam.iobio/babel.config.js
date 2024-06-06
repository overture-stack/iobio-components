const configs = {
	presets: [
		'@babel/preset-typescript',
		'@babel/preset-env',
		[
			'@babel/preset-react',
			{
				development: process.env.BABEL_ENV === 'development',
				runtime: 'automatic',
				importSource: '@emotion/react',
			},
		],
	],
	plugins: [
		[
			'module-resolver',
			{
				alias: {
					'^@/public': './public',
					'^@/(.+)': './src/\\1',
				},
				cwd: 'packagejson',
				extensions: ['.js', '.jsx', '.d.ts', '.ts', '.tsx'],
				root: ['./src'],
			},
		],
		'@emotion/babel-plugin',
		'@babel/plugin-transform-runtime',
	],
	sourceMaps: 'inline',
};

export default configs;
