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
					'50': '#f1f8fe',
					'100': '#e2f0fc',
					'200': '#bee0f9',
					'300': '#84c6f5',
					'400': '#43aaed',
					'500': '#1a8cd8',
					'600': '#0d70bc',
					'700': '#0c5998',
					'800': '#0e4d7e',
					'900': '#124168',
					'950': '#0c2945',
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
