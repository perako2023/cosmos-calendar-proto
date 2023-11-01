import { z } from 'zod'
import { protectedProcedure } from '~/server/api/trpc'

export const toggleLike = protectedProcedure
	.input(z.object({ eventId: z.string() }))
	.mutation(async ({ ctx, input }) => {
		const userId_eventId = { eventId: input.eventId, userId: ctx.session.user.id }

		const existingLike = await ctx.db.eventLike.findUnique({
			where: { userId_eventId },
		})

		let addedLike: boolean

		if (existingLike) {
			await ctx.db.eventLike.delete({ where: { userId_eventId } })
			addedLike = false
		} else {
			await ctx.db.eventLike.create({ data: userId_eventId })
			addedLike = true
		}

		const newLikesCount = await ctx.db.eventLike.count({
			where: { eventId: input.eventId },
		})

		return { addedLike, newLikesCount }
	})
