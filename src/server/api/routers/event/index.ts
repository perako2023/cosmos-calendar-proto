import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'

import { infiniteFeed } from './infiniteFeed'
import { toggleLike } from './toggleLike'

export const eventRouter = createTRPCRouter({
	infiniteFeed,
	toggleLike,

	create: protectedProcedure
		.input(
			z.object({
				title: z.string().min(1).max(300),
				date: z.date(),
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
				},
				select: { id: true },
			})
		}),
})
