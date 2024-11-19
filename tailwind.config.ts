const { nextui } = require('@nextui-org/react');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./app/**/*.{js,jsx,ts,tsx}', './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {},
	},
	plugins: [
		nextui({
			themes: {
				dark: {
					colors: {
						background: '#333333',
					},
				},
			},
		}),
	],
};
