import Link from 'next/link'
import { getServerAuthSession } from '~/server/auth'

type ReusableLinkProps = Omit<Parameters<typeof Link>[0], 'href'>

/** Link to sign out or sign in depending on the user session status */
export const AuthLink = async (props: ReusableLinkProps) => {
	const user = (await getServerAuthSession())?.user

	return (
		<Link {...props} href={user ? '/api/auth/signout' : '/api/auth/signin'}>
			{props.children ?? (user ? 'Sign out' : 'Sign in')}
		</Link>
	)
}
