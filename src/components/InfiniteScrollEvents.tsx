'use client'
import { api } from '~/trpc/react'
import InfiniteScroll from 'react-infinite-scroll-component'
import EventCard from './EventCard'
import { useSession } from 'next-auth/react'

type InfiniteScrollEventsProps = {
	initialData?: ReturnType<typeof api.event.infiniteFeed.useInfiniteQuery>['data']
}

export default function InfiniteScrollEvents({ initialData }: InfiniteScrollEventsProps) {
	const user = useSession().data?.user

	const infiniteQuery = api.event.infiniteFeed.useInfiniteQuery(
		{},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
			initialData,
			initialCursor: initialData,
		},
	)

	const events = infiniteQuery.data?.pages.flatMap((page) => page.events) ?? []

	// if (infiniteQuery.isLoading) return <p>Loading...</p>
	// if (infiniteQuery.isError) return <p>Error...</p>
	if (events.length === 0) {
		return (
			<div className="my-4">
				<p>There is currently no events posted yet...</p>
				{!user && <p>Sign in if you would like to be the first to post</p>}
			</div>
		)
	}

	return (
		<InfiniteScroll
			className="my-4"
			dataLength={events.length}
			next={infiniteQuery.fetchNextPage}
			hasMore={!!infiniteQuery.hasNextPage}
			loader={<p>Loading...</p>}
		>
			<ul className="grid gap-2">
				{events.map((event) => (
					<li key={event.id}>
						<EventCard {...event} />
					</li>
				))}
			</ul>
		</InfiniteScroll>
	)
}
