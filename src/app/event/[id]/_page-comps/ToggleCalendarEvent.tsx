'use client'
import { useState } from 'react'
import ToggleCalendarEvent from '~/components/EventCard/ToggleCalendarEvent'

export default function EventPage_ToggleCalendarEvent(
	props: Pick<Parameters<typeof ToggleCalendarEvent>[0], 'date' | 'eventId' | 'addedToCalendar'>,
) {
	const [addedToCalendar, setAddedToCalendar] = useState(props.addedToCalendar)

	return (
		<ToggleCalendarEvent
			{...props}
			addedToCalendar={addedToCalendar}
			onChange={(newValue) => {
				setAddedToCalendar(newValue)
			}}
		/>
	)
}
