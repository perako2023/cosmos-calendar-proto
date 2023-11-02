'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { type Socket, io } from 'socket.io-client'

const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000'

type ChatSocketContext = {
	socket: Socket | null
}

type ChatSocketProviderProps = {
	children: React.ReactNode
	roomId: string
}

const ChatSocketContext = createContext({} as ChatSocketContext)

export const useChatSocket = () => useContext(ChatSocketContext)

export default function ChatSocketProvider({ roomId, ...props }: ChatSocketProviderProps) {
	const [socket, setSocket] = useState<Socket | null>(null)

	useEffect(() => {
		const newSocket = io(URL!, {
			query: { roomId },
		})
		setSocket(newSocket)

		return () => void newSocket.close()
	}, [roomId])

	return <ChatSocketContext.Provider {...props} value={{ socket }} />
}
