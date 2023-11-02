import { ProfileLink } from '~/components/ReusableLinks'
import { api } from '~/trpc/server'
import EventPage_ToggleCalendarEvent from './_page-comps/ToggleCalendarEvent'
import EventPageFooter from './_page-comps/EventPageFooter'

type EventPageProps = { params: { id: string } }

export default async function EventPage(props: EventPageProps) {
	const eventData = await api.event.getOne.query({ eventId: props.params.id })

	if ('error' in eventData) return <p className="p-4 text-center text-2xl">{eventData.error}</p>

	return (
		<div className="container mx-auto my-4 max-w-4xl">
			<header className="flex px-4">
				<section>
					<ProfileLink
						userId={eventData.host.id}
						className="text-sm font-semibold text-white/70 hover:underline"
					>
						@{eventData.host.name}
					</ProfileLink>
					<h4 className="text-xl font-semibold">{eventData.title}</h4>
					<span>
						{'📅 '}
						{eventData.date.toLocaleString(undefined, {
							dateStyle: 'long',
							timeStyle: 'short',
						})}
					</span>
				</section>

				<section className="ml-auto">
					<EventPage_ToggleCalendarEvent
						addedToCalendar={eventData.addedToCalendar}
						date={eventData.date}
						eventId={eventData.id}
					/>
				</section>
			</header>

			<main className="mt-4 px-4">
				<p>{eventData.content}</p>
			</main>

			<EventPageFooter eventData={eventData} />
		</div>
	)
}
