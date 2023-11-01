'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'

type ReusableLinkProps = Omit<Parameters<typeof Link>[0], 'href'>

/** Link to sign out or sign in depending on the user session status */
export const AuthLink = (props: ReusableLinkProps) => {
	const user = useSession().data?.user

	return (
		<Link {...props} href={user ? '/api/auth/signout' : '/api/auth/signin'}>
			{props.children ?? (user ? 'Sign out' : 'Sign in')}
		</Link>
	)
}

export const ProfileLink = (
	props: ReusableLinkProps & {
		/** userId of the user to navigate to */
		userId: string
	},
) => {
	return <Link {...props} href={`/profile/${props.userId}`} />
}

export const EventLink = (
	props: ReusableLinkProps & {
		/**
		 * eventId of the event to navigate to \
		 * provide 'new' to go to create event page
		 */
		eventId: string
	},
) => {
	return <Link {...props} href={`/event/${props.eventId}`} />
}
