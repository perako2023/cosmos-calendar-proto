type EventPageProps = {
	params: {
		id: string
	}
}

export default function EventPage(props: EventPageProps) {
	return (
		<div>
			<h2>Event Page</h2>
			<p>eventId: {props.params.id}</p>
		</div>
	)
}
