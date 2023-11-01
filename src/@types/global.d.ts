import type { User, Event as EventSchema } from '@prisma/client'

declare global {
	namespace Cosmos {
		type Event = EventSchema & {
			host: Pick<User, 'id' | 'name'>

			addedToCalendar: boolean
		}
	}
}
