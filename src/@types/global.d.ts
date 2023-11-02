import type { User, Event as EventSchema, ChatRoomMessage } from '@prisma/client'

declare global {
	namespace Cosmos {
		type Event = EventSchema & {
			host: Pick<User, 'id' | 'name'>

			addedToCalendar: boolean
			_count: { likes: number }
			likedByCurrentUser: boolean
		}

		namespace Event {
			type Extras = {
				userJoinedChatRoom: boolean
			}
		}

		namespace ChatRoom {
			type Message = Pick<ChatRoomMessage, 'id' | 'content' | 'createdAt'> & {
				sender: Pick<User, 'name' | 'image' | 'id'>
			}
		}
	}
}
