import { redirect } from 'next/navigation'
import ChatSocketProvider from '~/components/ChatRoom/ChatSocketContext'
import InfiniteScrollMessages from '~/components/ChatRoom/InfiniteScrollMessages'
import ChatRoomMessageForm from '~/components/ChatRoom/MessageForm'
import { ChatLink } from '~/components/ReusableLinks'
import { db } from '~/server/db'

type EventChatRoomPageProps = {
	params: {
		eventId: string
	}
}

export default async function EventChatRoomPage(props: EventChatRoomPageProps) {
	const eventInfo = await db.event.findUnique({
		where: { id: props.params.eventId },
		select: { chatRoom: { select: { title: true, description: true, id: true } } },
	})

	const chatRoomInfo = eventInfo?.chatRoom

	if (!chatRoomInfo) redirect('/chat')

	return (
		<ChatSocketProvider roomId={chatRoomInfo.id}>
			<div className="container mx-auto flex max-w-4xl flex-col border-x">
				<header className="sticky top-[65px] flex items-center border-b bg-base-100 px-4 py-2">
					<ChatLink className="btn text-2xl text-secondary-500 hover:bg-secondary-900">
						{'<'}
					</ChatLink>

					<div className="collapse bg-base-200">
						<input type="checkbox" className="peer" />
						<div className="collapse-title flex items-center justify-center text-lg font-semibold">
							<h4>{chatRoomInfo.title}</h4>
						</div>
						<div className="collapse-content">
							<p>{chatRoomInfo.description}</p>
						</div>
					</div>
				</header>

				<main>
					<InfiniteScrollMessages roomId={eventInfo.chatRoom.id} />
				</main>

				<footer className="sticky bottom-0 mt-auto bg-base-100">
					<ChatRoomMessageForm roomId={eventInfo.chatRoom.id} />
				</footer>
			</div>
		</ChatSocketProvider>
	)
}
