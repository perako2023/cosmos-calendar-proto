import { z } from 'zod'
import { publicProcedure } from '~/server/api/trpc'

export const infiniteMessages = publicProcedure
	.input(
		z.object({
			/** defaults to 15 */
			limit: z.number().min(1).max(100).optional(),
			cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
			roomId: z.string(),
		}),
	)
	.query(async ({ ctx, input: { limit = 15, cursor, roomId } }) => {
		const messages: Cosmos.ChatRoom.Message[] = await ctx.db.chatRoomMessage.findMany({
			orderBy: [{ createdAt: 'desc' }],
			take: limit + 1,
			cursor: cursor ? { createdAt_id: cursor } : undefined,

			where: { chatRoomId: roomId },

			select: {
				id: true,
				createdAt: true,
				content: true,
				sender: { select: { image: true, name: true, id: true } },
			},
		})

		let nextCursor: typeof cursor | undefined
		if (messages.length > limit) {
			const nextItem = messages.pop()
			if (nextItem) nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt }
		}

		return { messages, nextCursor }
	})
