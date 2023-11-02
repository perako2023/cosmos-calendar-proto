import { z } from 'zod'
import { protectedProcedure } from '~/server/api/trpc'

export const sendMessage = protectedProcedure

	.input(
		z.object({
			content: z.string().min(1),
			roomId: z.string(),
			parentId: z.string().optional(),
		}),
	)

	.mutation(async ({ ctx, input }) => {
		const newMessage: Cosmos.ChatRoom.Message = await ctx.db.chatRoomMessage.create({
			data: {
				content: input.content,
				sender: { connect: { id: ctx.session.user.id } },
				chatRoom: { connect: { id: input.roomId } },
				parent: input.parentId ? { connect: { id: input.parentId } } : undefined,
			},

			select: {
				id: true,
				createdAt: true,
				content: true,
				sender: { select: { image: true, name: true, id: true } },
			},
		})

		return newMessage
	})
