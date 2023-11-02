import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'

import { sendMessage } from './sendMessage'
import { infiniteMessages } from './infiniteMessages'

export const chatRoomRouter = createTRPCRouter({
	sendMessage,
	infiniteMessages,

	join: protectedProcedure
		.input(z.object({ roomId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const currentUserId = ctx.session?.user.id

			const res = await ctx.db.chatRoom.update({
				where: { id: input.roomId },
				data: {
					users: { connect: { id: currentUserId } },
				},
				select: { id: true },
			})

			return {
				/** whether the current user has joined the chat room or not */
				userJoinedChatRoom: !!res.id,
			}
		}),
})
