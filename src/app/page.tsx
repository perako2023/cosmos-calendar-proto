import Image from 'next/image'
import InfiniteScrollEvents from '~/components/InfiniteScrollEvents'
import { EventLink, ProfileLink } from '~/components/ReusableLinks'
import { getServerAuthSession } from '~/server/auth'
import { api } from '~/trpc/server'

export default async function HomePage() {
	const user = (await getServerAuthSession())?.user
	const initialEventsData = await api.event.infiniteFeed.query({})

	return (
		<div>
			{user && (
				<div className="my-4 flex gap-2 rounded-lg border border-white/20 p-4">
					<ProfileLink userId={user.id}>
						<Image
							className="rounded-full"
							src={user.image ?? ''}
							alt="user profile image"
							width={48}
							height={48}
						/>
					</ProfileLink>

					<div className="flex grow flex-col gap-2">
						<EventLink
							eventId="new"
							className="border-b border-white/20 py-2 text-white/60 md:text-lg"
						>
							What event do you have in mind?
						</EventLink>
						<EventLink eventId="new" className="btn btn-secondary btn-sm ml-auto">
							Post
						</EventLink>
					</div>
				</div>
			)}

			<InfiniteScrollEvents initialData={{ pageParams: [], pages: [initialEventsData] }} />
		</div>
	)
}
