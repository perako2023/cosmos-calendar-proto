'use client'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import toast from 'react-hot-toast'
import TextEditor from '~/components/TextEditor'
import { api } from '~/trpc/react'

export default function CreateEventPage() {
	const router = useRouter()
	const [canPost, setCanPost] = useState(true)
	const trpcUtils = api.useUtils()

	const [title, setTitle] = useState('')
	const [content, setContent] = useState('')
	const [date, setDate] = useState<Date | null>(null)

	const createEvent = api.event.create.useMutation({
		onSuccess: async (data) => {
			toast.success('Event created successfully!')
			await trpcUtils.event.infiniteFeed.invalidate()
			setCanPost(false)
			router.push(`/event/${data.id}`)
		},
		onError: () => {
			toast.error('Event creation failed, \nplease try again.', { duration: 3000 })
		},
	})

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (createEvent.isLoading) return
		if (!title.trim() || !date || !dayjs(date).isValid()) return

		createEvent.mutate({ title: title.trim(), content: content.trim(), date })
	}

	return (
		<div className="container mx-auto max-w-4xl p-4">
			<form onSubmit={handleSubmit}>
				<fieldset className="flex flex-col gap-4">
					<legend className="mx-auto mb-4 text-xl font-semibold">Create Event</legend>

					<label className="flex flex-col gap-2">
						<span className="text-primary text-lg font-medium">
							{'Title '}
							<span className="text-sm text-white/60">{`${title.length}/300`}</span>
						</span>
						<TextEditor
							className="pr-18 grow"
							name="title"
							rows={1}
							maxLength={300}
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							autoFocus
							noNewLine
						/>
					</label>

					<label className="flex w-min flex-col gap-2">
						<span className="text-primary text-lg font-medium">Date and time</span>
						<DatePicker
							className="input border border-white/20"
							onChange={(inputDate: Date) => setDate(inputDate)}
							minDate={new Date()}
							selected={date}
							showTimeInput
							todayButton="Today"
							isClearable
							dateFormat="MMMM d, yyyy h:mm aa"
							required
						/>
					</label>

					<label className="flex flex-col gap-2">
						<span className="text-primary text-lg font-medium">Content</span>
						<TextEditor
							name="content"
							placeholder="(optional)"
							value={content}
							onChange={(e) => setContent(e.target.value)}
						/>
					</label>

					<button
						disabled={!title.trim() || !dayjs(date).isValid() || !canPost}
						type="submit"
						className="btn btn-secondary"
					>
						{createEvent.isLoading ? (
							<span className="flex items-center gap-1">
								Posting <span className="loading loading-spinner loading-sm" />
							</span>
						) : (
							'Post'
						)}
					</button>
				</fieldset>
			</form>
		</div>
	)
}
