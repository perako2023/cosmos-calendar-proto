import { ChatLink } from '~/components/ReusableLinks'
import { getServerAuthSession } from '~/server/auth'
import { db } from '~/server/db'

export default async function ChatPage() {
	const user = (await getServerAuthSession())?.user

	const chatRooms =
		user &&
		(await db.chatRoom.findMany({
			where: { users: { some: { id: user.id } } },
			select: {
				id: true,
				title: true,
				event: {
					select: {
						id: true,
					},
				},
			},
			take: 10,
		}))

	return (
		<div className="container mx-auto max-w-4xl p-4">
			<header>
				<input
					type="text"
					name="chat-room-search"
					className="input w-full border"
					placeholder="Search..."
				/>
			</header>

			<main>
				<h4 className="my-4 text-xl font-semibold">Event Chat Rooms</h4>
				<ul className="flex flex-col gap-2">
					{chatRooms?.map((chatRoom) => {
						if (chatRoom.event?.id) {
							return (
								<li key={chatRoom.id} className="flex">
									<ChatLink
										roomId={`event/${chatRoom.event.id}`}
										className="btn btn-secondary btn-sm"
									>
										{chatRoom.title.slice(0, 30)}
									</ChatLink>
								</li>
							)
						}
					})}
				</ul>

				<h4>...</h4>
				<ul className="flex flex-col gap-2">
					{chatRooms?.map((chatRoom) => {
						if (!chatRoom.event?.id) {
							return (
								<li key={chatRoom.id} className="flex">
									<ChatLink
										roomId={`event/${chatRoom.id}`}
										className="btn btn-secondary btn-sm"
									>
										{chatRoom.title.slice(0, 30)}
									</ChatLink>
								</li>
							)
						}
					})}
				</ul>
			</main>
		</div>
	)
}
