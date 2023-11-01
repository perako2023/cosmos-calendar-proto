import { createTRPCRouter } from '~/server/api/trpc'

import { eventRouter } from '~/server/api/routers/event'
import { calendarRouter } from '~/server/api/routers/calendar'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	event: eventRouter,
	calendar: calendarRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
