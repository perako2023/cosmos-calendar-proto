import Image from 'next/image'
import dayjsExtended from '~/utils/dayjs'

export default function MessageCard(props: Cosmos.ChatRoom.Message) {
	return (
		<div className="mx-2 flex gap-4 rounded-lg border px-2 py-2">
			<aside className="shrink-0">
				<Image
					className="aspect-square rounded-lg"
					src={props.sender.image ?? ''}
					alt="message sender profile image"
					width={48}
					height={48}
				/>
			</aside>

			<section>
				<header className="flex items-center gap-2">
					<span className="text-secondary-500">{props.sender.name}</span>
					<span className="text-sm font-semibold text-white/60">
						{dayjsExtended(props.createdAt).fromNow()}
					</span>
				</header>
				<div className="whitespace-pre-wrap break-all">{props.content}</div>
			</section>
		</div>
	)
}
