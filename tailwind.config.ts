import { type Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

export default {
	mode: 'jit',

	content: ['./src/**/*.tsx'],

	theme: {
		extend: {
			fontFamily: {
				sans: ['var(--font-sans)', ...fontFamily.sans],
			},

			colors: {
				primary: {
					'50': '#fef2f2',
					'100': '#fee2e2',
					'200': '#fecaca',
					'300': '#fca5a5',
					'400': '#f87171',
					'500': '#ef4444',
					'600': '#dc2626',
					'700': '#b91c1c',
					'800': '#991b1b',
					'900': '#7f1d1d',
					'950': '#450a0a',
				},
				secondary: {
					'50': '#e8f1ff',
					'100': '#d5e4ff',
					'200': '#b3ccff',
					'300': '#85a8ff',
					'400': '#5676ff',
					'500': '#2f45ff',
					'600': '#0c0eff',
					'700': '#0000ff',
					'800': '#0609cd',
					'900': '#10169f',
					'950': '#0a0b5c',
				},
			},
		},
	},

	daisyui: {
		themes: [
			{
				dark: {
					// primary: '#b91c1c',
					// secondary: '',
					// accent: '',
					// neutral: '',
					'base-100': '#000000',
					// info: '',
					// success: '',
					// warning: '',
					// error: '#b91c1c',
				},
			},
		],
	},

	plugins: [require('daisyui')],
} satisfies Config
