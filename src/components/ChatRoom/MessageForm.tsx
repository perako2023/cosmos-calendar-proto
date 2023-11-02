'use client'
import { useRef, useState } from 'react'
import TextEditor from '../TextEditor'
import { api } from '~/trpc/react'
import { useChatSocket } from './ChatSocketContext'

export default function ChatRoomMessageForm(props: { roomId: string }) {
	const formRef = useRef<HTMLFormElement>(null)
	const [content, setContent] = useState('')
	const chatSocket = useChatSocket().socket

	const sendMessage = api.chatRoom.sendMessage.useMutation({
		onSuccess: (data) => {
			chatSocket?.emit('send_message', data)
			setContent('')
		},
	})

	const canSend = content.trim().length > 0 && !sendMessage.isLoading

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!canSend) return
		sendMessage.mutate({ content: content.trim(), roomId: props.roomId })
	}

	return (
		<form ref={formRef} onSubmit={handleSubmit} className="flex h-full w-full gap-2 p-4">
			<TextEditor
				className="max-h-96 w-full"
				rows={1}
				placeholder="Type a message..."
				value={content}
				onChange={(e) => setContent(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === 'Enter' && !e.shiftKey) {
						e.preventDefault()
						formRef.current?.requestSubmit()
					}
				}}
				autoFocus
			/>
			<button disabled={!canSend} type="submit" className="btn btn-secondary mt-auto">
				{'Send '}
				{sendMessage.isLoading && <span className="loading loading-spinner loading-sm" />}
			</button>
		</form>
	)
}
