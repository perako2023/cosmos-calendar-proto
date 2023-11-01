'use client'
import { api } from '~/trpc/react'
import { ProfileLink } from '../ReusableLinks'
import ToggleCalendarEvent from './ToggleCalendarEvent'

export default function EventCard(props: Cosmos.Event) {
	const trpcUtils = api.useUtils()

	if (!props.date) {
		console.warn(`EventCard with "eventId: ${props.id}" has invalid date`)
		return null
	}

	const updateOne = ({ updatedProperties }: { updatedProperties: Partial<Cosmos.Event> }) => {
		trpcUtils.event.infiniteFeed.setInfiniteData({}, (oldData) => {
			if (!oldData) return

			return {
				...oldData,
				pages: oldData.pages.map((page) => {
					return {
						...page,
						events: page.events.map((event) => {
							if (event.id !== props.id) return event
							return {
								...event,
								...updatedProperties,
							}
						}),
					}
				}),
			}
		})
	}
	return (
		<div className="rounded-lg border border-white/20 px-4 py-2">
			<header className="flex">
				<section>
					<ProfileLink
						userId={props.host.id}
						className="text-sm font-semibold text-white/70 hover:underline"
					>
						@{props.host.name}
					</ProfileLink>
					<h4 className="text-xl font-semibold">{props.title}</h4>
					<span>
						{'📅 '}
						{props.date.toLocaleString(undefined, {
							dateStyle: 'long',
							timeStyle: 'short',
						})}
					</span>
				</section>

				<section className="ml-auto">
					<ToggleCalendarEvent
						onChange={(newValue) =>
							updateOne({ updatedProperties: { addedToCalendar: newValue } })
						}
						addedToCalendar={props.addedToCalendar}
						date={props.date}
						eventId={props.id}
					/>
				</section>
			</header>

			<main className="mt-2">
				<p>{props.content}</p>
			</main>
		</div>
	)
}
