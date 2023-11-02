import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'

import { infiniteFeed } from './infiniteFeed'
import { toggleLike } from './toggleLike'
import { getOne } from './getOne'
import { getChatRoomHighlights } from './getChatRoomHighlights'

export const eventRouter = createTRPCRouter({
	infiniteFeed,
	toggleLike,
	getOne,
	getChatRoomHighlights,

	create: protectedProcedure
		.input(
			z.object({
				title: z.string().min(1).max(300),
				date: z.date().min(new Date()),
				content: z.string().optional(),
			}),
		)
		.mutation(({ ctx, input }) => {
			return ctx.db.event.create({
				data: {
					title: input.title,
					date: input.date,
					content: input.content,
					host: { connect: { id: ctx.session.user.id } },
					chatRoom: {
						create: {
							title: input.title.slice(0, 30), //TODO: let the user customize this on event creation
							description: input.title,
							users: {
								connect: {
									id: ctx.session.user.id,
								},
							},
						},
					},
				},
				select: { id: true },
			})
		}),
})
