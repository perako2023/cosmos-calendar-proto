/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').options} */
const config = {
	plugins: ['prettier-plugin-tailwindcss'],
	singleQuote: true,
	semi: false,
	tabWidth: 4,
	printWidth: 100,
	useTabs: true,
}

export default config
