import type { ChatRoomMessage } from '@prisma/client'
import { z } from 'zod'
import { publicProcedure } from '~/server/api/trpc'

export const getChatRoomHighlights = publicProcedure

	.input(z.object({ eventId: z.string() }))
	.query(async ({ ctx, input }) => {
		const event = await ctx.db.chatRoom.findUnique({
			where: { id: input.eventId },
			select: {
				messages: {
					take: 10,
				},
			},
		})

		return (event?.messages ?? []) satisfies ChatRoomMessage[]
	})
