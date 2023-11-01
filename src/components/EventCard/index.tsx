import { ProfileLink } from '../ReusableLinks'

export default function EventCard(props: Cosmos.Event) {
	return (
		<div className="rounded-lg border border-white/20 px-4 py-2">
			<header>
				<ProfileLink
					userId={props.host.id}
					className="text-sm font-semibold text-white/70 hover:underline"
				>
					@{props.host.name}
				</ProfileLink>
				<h4 className="text-xl font-semibold">{props.title}</h4>
			</header>

			<main className="mt-2">
				<p>{props.content}</p>
			</main>
		</div>
	)
}
