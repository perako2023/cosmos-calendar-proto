import '~/styles/globals.css'

import { Inter } from 'next/font/google'
import { headers } from 'next/headers'

import { TRPCReactProvider } from '~/trpc/react'

import RootLayoutTopBar from '~/components/RootLayout/TopBar'

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-sans',
})

export const metadata = {
	title: 'Cosmos Calendar',
	description: 'Get excited with people who are looking forward to the same event as you.',
	icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={`font-sans ${inter.variable}`}>
				<TRPCReactProvider headers={headers()}>
					<RootLayoutTopBar />

					<main className="container mx-auto max-w-4xl">{children}</main>
				</TRPCReactProvider>
			</body>
		</html>
	)
}
