'use client'
import { api } from '~/trpc/react'
import MessageCard from './MessageCard'
import { useEffect, useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { useChatSocket } from './ChatSocketContext'
import { useScrollToBottom } from '~/utils'
import { useSession } from 'next-auth/react'

type InfiniteScrollEventsProps = {
	initialData?: ReturnType<typeof api.chatRoom.infiniteMessages.useInfiniteQuery>['data']
	roomId: string
}

export default function InfiniteScrollMessages(props: InfiniteScrollEventsProps) {
	const user = useSession().data?.user

	const [canFetchMore, setCanFetchMore] = useState(false)

	const infiniteQuery = api.chatRoom.infiniteMessages.useInfiniteQuery(
		{ roomId: props.roomId },
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		},
	)

	const messages = useMemo(() => {
		return infiniteQuery.data?.pages.flatMap((page) => page.messages) ?? []
	}, [infiniteQuery.data?.pages])

	useEffect(() => {
		window.scrollTo(0, document.body.scrollHeight)
		let timeOut: NodeJS.Timeout

		if (!canFetchMore) {
			timeOut = setTimeout(() => {
				setCanFetchMore(true)
			}, 3_000)
		}

		return () => {
			clearTimeout(timeOut)
		}
	}, [canFetchMore, infiniteQuery.isFetchedAfterMount])

	const scrollToBottom = useScrollToBottom()

	const chatSocket = useChatSocket().socket
	const trpcUtils = api.useUtils()
	useEffect(() => {
		const onReceiveMessage = (data: Cosmos.ChatRoom.Message) => {
			trpcUtils.chatRoom.infiniteMessages.setInfiniteData(
				{ roomId: props.roomId },
				(oldData) => {
					if (!oldData) return

					return {
						...oldData,
						pages: oldData.pages.map((page) => {
							return {
								...page,
								messages: [data, ...page.messages], //* order is important so the new data is at the bottom
							}
						}),
					}
				},
			)
			if (data.sender.id === user?.id) scrollToBottom.trigger()
		}

		chatSocket?.on('receive_message', onReceiveMessage)
		return () => {
			void chatSocket?.off('receive_message', onReceiveMessage)
		}
	}, [chatSocket, props.roomId, scrollToBottom, trpcUtils.chatRoom.infiniteMessages, user?.id])

	return (
		<InfiniteScroll
			loadMore={() => {
				if (canFetchMore) void infiniteQuery.fetchNextPage()
			}}
			hasMore={canFetchMore && infiniteQuery.hasNextPage}
			loader={<span className="loading loading-spinner loading-md mx-auto my-4 block" />}
			isReverse
		>
			{(infiniteQuery.isLoading || infiniteQuery.isFetching) && (
				<div className="h-screen w-full animate-pulse rounded-lg bg-white/5" />
			)}
			<ul className="flex flex-col-reverse gap-2 py-2">
				{messages.map((message) => (
					<li key={message.id}>
						<MessageCard {...message} />
					</li>
				))}
			</ul>
		</InfiniteScroll>
	)
}
