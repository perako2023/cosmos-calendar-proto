'use client'
import { useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { api } from '~/trpc/react'
import { useSession } from 'next-auth/react'

export type ToggleCalendarEventProps = {
	date: Date
	eventId: string
	addedToCalendar: boolean

	children?: React.ReactNode

	/** @param addedToCalendar - whether the event was added to the calendar or removed */
	onChange?: (addedToCalendar: boolean) => void
}

/** Add or remove an event from the user's calendar on click */
export default function ToggleCalendarEvent(props: ToggleCalendarEventProps) {
	const session = useSession()
	const toastId = useRef('')

	const toggleEventFromCalendar = api.calendar.toggleEvent.useMutation()

	useEffect(() => {
		return () => toast.dismiss(toastId.current)
	}, [])

	const handleAddToCalendar = () => {
		if (session.status === 'loading') return
		if (session.status === 'unauthenticated') {
			toast('You need to sign in if you want to add events on your calendar', {
				duration: 5000,
			})
			return
		}

		toast.dismiss(toastId.current)
		toastId.current = toast.loading(
			`${props.addedToCalendar ? 'removing from' : 'adding to'} calendar`,
			{ duration: 300_000 },
		)

		toggleEventFromCalendar.mutate(
			{ eventId: props.eventId },
			{
				onSuccess(data) {
					props.onChange?.(data.eventAdded)
					toast.dismiss(toastId.current)
					toastId.current = toast(
						<div className="flex items-center gap-2">
							{data.eventAdded ? '✔ Added to calendar' : '❌ Removed from calendar'}
						</div>,
					)
				},
				onError() {
					toast.dismiss(toastId.current)
					toast.error(
						`Failed to ${props.addedToCalendar ? 'remove from' : 'add to'} calendar`,
					)
				},
			},
		)
	}

	return (
		<button onClick={handleAddToCalendar} disabled={toggleEventFromCalendar.isLoading}>
			{props.children ? (
				props.children
			) : (
				<span className="flex h-min w-min flex-col items-center overflow-hidden rounded-md border border-white/20 transition hover:-translate-x-0.5">
					<span
						className={`px-2 text-sm uppercase text-white transition-colors 
                        ${
							session.data?.user
								? props.addedToCalendar
									? 'bg-red-500'
									: 'bg-gray-500'
								: 'bg-red-500'
						}`}
					>
						{props.date.toLocaleString(undefined, { month: 'short' })}
					</span>
					<span
						className={`w-full pb-1 text-xl font-semibold transition-colors ${
							props.addedToCalendar || !session.data?.user
								? 'bg-gray-100 text-black/60'
								: ''
						}`}
					>
						{props.date.toLocaleString(undefined, { day: '2-digit' })}
					</span>
				</span>
			)}
		</button>
	)
}
