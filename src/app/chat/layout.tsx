import { redirect } from 'next/navigation'
import { getServerAuthSession } from '~/server/auth'

export default async function ChatLayout({ children }: { children: React.ReactNode }) {
	const user = await getServerAuthSession()

	if (!user) return redirect('/api/auth/signin')

	return <>{children}</>
}
