module.exports = {
	plugins: ['@emotion/babel-plugin'],
	presets: [
		[
			{
				'preset-react': {
					development: process.env.BABEL_ENV === 'development',
					runtime: 'automatic',
					importSource: '@emotion/react',
				},
			},
		],
		'@babel/preset-typescript',
	],
};
