import '~/styles/globals.css'

import { Inter } from 'next/font/google'
import { headers } from 'next/headers'

import { TRPCReactProvider } from '~/trpc/react'

import RootLayoutTopBar from '~/components/RootLayout/TopBar'
import Toaster from '~/components/Toaster'
import AuthProvider from '~/context/AuthContext'
import { getServerAuthSession } from '~/server/auth'

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-sans',
})

export const metadata = {
	title: 'Cosmos Calendar',
	description: 'Get excited with people who are looking forward to the same event as you.',
	icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const session = await getServerAuthSession()

	return (
		<html lang="en">
			<body className={`font-sans ${inter.variable}`}>
				<Toaster />
				<TRPCReactProvider headers={headers()}>
					<AuthProvider session={session}>
						<div className="flex min-h-screen flex-col">
							<RootLayoutTopBar />

							<main className="flex grow [&>*]:grow">{children}</main>
						</div>
					</AuthProvider>
				</TRPCReactProvider>
			</body>
		</html>
	)
}
