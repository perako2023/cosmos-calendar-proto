import Image from 'next/image'
import { EventLink, ProfileLink } from '~/components/ReusableLinks'
import { getServerAuthSession } from '~/server/auth'

export default async function HomePage() {
	const user = (await getServerAuthSession())?.user

	return (
		<div className="p-4">
			{user && (
				<div className="flex gap-2 rounded-lg border border-white/20 p-4">
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
		</div>
	)
}
