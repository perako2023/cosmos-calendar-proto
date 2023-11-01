import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'

export const calendarRouter = createTRPCRouter({
	toggleEvent: protectedProcedure
		.input(z.object({ eventId: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			const currentUserId = ctx.session.user.id

			//TODO - create a calendar for new user on first login then update this
			const existingEvent = await ctx.db.calendar.upsert({
				where: { ownerId: currentUserId },
				create: { ownerId: currentUserId },
				update: {},
				select: {
					events: { where: { id: input.eventId } },
				},
			})

			let eventAdded: boolean

			if (existingEvent.events.length > 0) {
				await ctx.db.calendar.update({
					where: { ownerId: currentUserId },
					data: { events: { disconnect: { id: input.eventId } } },
				})
				eventAdded = false
			} else {
				await ctx.db.calendar.update({
					where: { ownerId: currentUserId },
					data: { events: { connect: { id: input.eventId } } },
				})
				eventAdded = true
			}

			return { eventAdded }
		}),
})
