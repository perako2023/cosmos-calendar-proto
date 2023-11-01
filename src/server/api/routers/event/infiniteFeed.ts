import { z } from 'zod'
import { publicProcedure } from '~/server/api/trpc'

export const infiniteFeed = publicProcedure
	.input(
		z.object({
			/** defaults to 10 */
			limit: z.number().min(1).max(100).optional(),
			cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
		}),
	)
	.query(async ({ ctx, input: { limit = 10, cursor } }) => {
		const events = await ctx.db.event.findMany({
			orderBy: [{ createdAt: 'desc' }, { title: 'asc' }],
			take: limit + 1,
			cursor: cursor ? { createdAt_id: cursor } : undefined,
			include: {
				host: { select: { id: true, name: true } },
			},
		})

		let nextCursor: typeof cursor | undefined
		if (events.length > limit) {
			const nextItem = events.pop()
			if (nextItem) nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt }
		}

		return {
			events: events.map((event) => {
				return {
					id: event.id,
					title: event.title,
					date: event.date,
					content: event.content,

					host: event.host,
					hostId: event.hostId,
					createdAt: event.createdAt,
					updatedAt: event.updatedAt,
				} satisfies Cosmos.Event
			}),
			nextCursor,
		}
	})
