import { heroui } from "@heroui/react"

import type { Config } from 'tailwindcss'

export default {
	content: ['./app/**/*.{js,jsx,ts,tsx}', "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
			},
		},
	},
	darkMode: 'class',
	plugins: [
		heroui({
			themes: {
				dark: {
					colors: {
						background: '#0a0a0a',
						foreground: '#fafafa',
						default: {
							100: '#1a1a1a',
							200: '#2a2a2a',
							300: '#3a3a3a',
							700: '#ffffff',
							DEFAULT: '#0066ff',
							foreground: '#ffffff',
						},
						primary: {
							DEFAULT: '#0066ff',
							foreground: '#ffffff',
						},
						secondary: {
							DEFAULT: '#1a1a1a',
							foreground: '#a1a1a1',
						},
						content1: '#1a1a1a',
						content2: '#222222',
						content3: '#2a2a2a',
						content4: '#333333',
						divider: '#2a2a2a',
						focus: '#0066ff',
					},
				},
				light: {
					colors: {
						background: '#f5f5f5',
						foreground: '#0a0a0a',
						default: {
							100: '#f0f0f0',
							200: '#e5e5e5',
							300: '#d4d4d4',
							700: '#1a1a1a',
							DEFAULT: '#0066ff',
							foreground: '#0a0a0a',
						},
						primary: {
							DEFAULT: '#0066ff',
							foreground: '#ffffff',
						},
						secondary: {
							DEFAULT: '#e5e5e5',
							foreground: '#525252',
						},
						content1: '#ffffff',
						content2: '#fafafa',
						content3: '#f5f5f5',
						content4: '#e5e5e5',
						divider: '#e5e5e5',
						focus: '#0066ff',
					},
				},
			},
		}),
	],
} satisfies Config
