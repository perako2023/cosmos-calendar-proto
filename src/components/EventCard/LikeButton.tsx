'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { api } from '~/trpc/react'

export type LikeButtonProps = {
	eventId: string
	likedByCurrentUser: boolean
	onChange?: (newValue: { addedLike: boolean; newLikesCount: number }) => void
}

export default function LikeButton(props: LikeButtonProps) {
	const user = useSession().data?.user
	const router = useRouter()

	const toggleLike = api.event.toggleLike.useMutation({
		onSuccess: (newValue) => {
			props.onChange?.(newValue)
		},
	})

	return (
		<button
			onClick={() => {
				if (!user) {
					return router.push('/api/auth/signin')
				}
				toggleLike.mutate({ eventId: props.eventId })
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill={props.likedByCurrentUser ? 'red' : 'none'}
				viewBox="0 0 24 24"
				strokeWidth={1.5}
				stroke={props.likedByCurrentUser ? 'red' : 'currentColor'}
				className="h-6 w-6 transition"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
				/>
			</svg>
		</button>
	)
}
