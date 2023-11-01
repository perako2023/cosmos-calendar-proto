import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'

export const eventRouter = createTRPCRouter({
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
