'use client'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import LikeButton from '~/components/EventCard/LikeButton'
import { api } from '~/trpc/react'

export default function EventPageFooter({
	eventData,
}: {
	eventData: Cosmos.Event & Cosmos.Event.Extras
}) {
	const [likedByCurrentUser, setLikedByCurrentUser] = useState(eventData.likedByCurrentUser)
	const [likesCount, setLikesCount] = useState(eventData._count.likes)

	const getChatRoomHighlights = api.event.getChatRoomHighlights.useQuery({
		eventId: eventData.id,
	})

	return (
		<footer className="mt-4">
			<section className="flex items-center justify-center gap-4 border-y border-white/20 px-4 py-2">
				<span className="flex items-center">
					<LikeButton
						eventId={eventData.id}
						likedByCurrentUser={likedByCurrentUser}
						onChange={(newValue) => {
							setLikesCount(newValue.newLikesCount)
							setLikedByCurrentUser(newValue.addedLike)
						}}
					/>
					<span className="ml-1 font-medium">
						{likesCount > 0 &&
							likesCount.toLocaleString(undefined, {
								notation: 'compact',
							})}
						{likesCount > 1 ? ' Likes' : ' Like'}
					</span>
				</span>

				<ChatRoomButton
					userJoinedChatRoom={eventData.userJoinedChatRoom}
					eventId={eventData.id}
					roomId={eventData.chatRoomId}
				/>
			</section>

			<section>
				<h4 className="px-4 py-2 font-semibold">Chat Room Highlights</h4>
				<p className="whitespace-pre-wrap rounded-lg border border-white/20 p-4">
					{JSON.stringify(getChatRoomHighlights.data, null, 4)}
				</p>
			</section>
		</footer>
	)
}

const ChatRoomButton = (props: {
	userJoinedChatRoom: boolean
	eventId: string
	roomId: string
}) => {
	const user = useSession().data?.user
	const [userJoinedChatRoom, setUserJoinedChatRoom] = useState(props.userJoinedChatRoom)
	const router = useRouter()
	const joinEventChatRoom = api.chatRoom.join.useMutation({
		onSuccess: (data) => {
			setUserJoinedChatRoom(data.userJoinedChatRoom)
		},
	})

	const handleClick = () => {
		if (joinEventChatRoom.isLoading) return
		if (!user) return signIn()
		if (userJoinedChatRoom) {
			router.push(`/chat/event/${props.eventId}`)
		} else {
			joinEventChatRoom.mutate({ roomId: props.roomId })
		}
	}

	return (
		<button
			className={`btn btn-secondary btn-sm 
                ${joinEventChatRoom.isLoading ? 'cursor-not-allowed' : ''}`}
			onClick={handleClick}
		>
			{userJoinedChatRoom ? 'Go to' : 'Join'} chat room
			{joinEventChatRoom.isLoading && <span className="loading loading-xs" />}
		</button>
	)
}
