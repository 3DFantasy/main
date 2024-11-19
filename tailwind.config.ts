const { nextui } = require('@nextui-org/react')

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
						foreground: '#ffffff',
						primary: {
							50: '#3B096C',
							100: '#520F83',
							200: '#7318A2',
							300: '#9823C2',
							400: '#c031e2',
							500: '#DD62ED',
							600: '#F182F6',
							700: '#FCADF9',
							800: '#FDD5F9',
							900: '#FEECFE',
							DEFAULT: '#DD62ED',
							foreground: '#ffffff',
						},
						focus: '#F182F6',
					},
				},
				light: {
					colors: {
						background: '#f2f2f2',
						foreground: '#1a1a1a',
						default: {
							// 50: '#3B096C',
							// 100: '#520F83',
							// 200: '#7318A2',
							// 300: '#9823C2',
							// 400: '#c031e2',
							// 500: '#DD62ED',
							// 600: '#F182F6',
							700: '#1a1a1a',
							// 800: '#FDD5F9',
							// 900: '#FEECFE',
							DEFAULT: '#0066ff',
							// foreground: '#1a1a1a',
						},

						primary: {
							// 50: '#3B096C',
							// 100: '#520F83',
							// 200: '#7318A2',
							// 300: '#9823C2',
							// 400: '#c031e2',
							// 500: '#DD62ED',
							// 600: '#F182F6',
							700: '#1a1a1a',
							// 800: '#FDD5F9',
							// 900: '#FEECFE',
							DEFAULT: '#3385ff',
							// foreground: '#1a1a1a',
						},
						secondary: {
							// 50: '#3B096C',
							// 100: '#520F83',
							// 200: '#7318A2',
							// 300: '#9823C2',
							// 400: '#c031e2',
							// 500: '#DD62ED',
							// 600: '#F182F6',
							700: '#1a1a1a',
							// 800: '#FDD5F9',
							// 900: '#FEECFE',
							DEFAULT: '#333333',
							// foreground: '#1a1a1a',
						},
						focus: '#F182F6',
					},
				},
			},
		}),
	],
}
