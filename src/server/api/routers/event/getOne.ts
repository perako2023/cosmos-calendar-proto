import { z } from 'zod'
import { publicProcedure } from '~/server/api/trpc'

export const getOne = publicProcedure
	.input(z.object({ eventId: z.string() }))
	.query(async ({ ctx, input }) => {
		const currentUserId = ctx.session?.user.id

		const event = await ctx.db.event.findUnique({
			where: { id: input.eventId },
			include: {
				host: { select: { id: true, name: true } },
				_count: { select: { likes: true } },

				likes: {
					where: { userId: currentUserId },
					select: { id: true },
				},

				calendars: {
					where: { ownerId: currentUserId },
					select: { id: true },
				},

				chatRoom: {
					select: {
                        id: true,
						users: {
							where: { id: currentUserId },
						},
					},
				},
			},
		})

		if (!event) return { error: 'Event not found' }

		return {
			id: event.id,
			title: event.title,
			date: event.date,
			content: event.content,
			chatRoomId: event.chatRoomId,

			addedToCalendar: event.calendars.length > 0,
			likedByCurrentUser: event.likes.length > 0,
			userJoinedChatRoom: !!currentUserId && (event.chatRoom?.users.length ?? 0) > 0,

			_count: event._count,

			host: event.host,
			hostId: event.hostId,
			createdAt: event.createdAt,
			updatedAt: event.updatedAt,
		} satisfies Cosmos.Event & Cosmos.Event.Extras
	})
