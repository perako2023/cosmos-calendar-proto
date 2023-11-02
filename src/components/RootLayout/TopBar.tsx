import Link from 'next/link'
import Image from 'next/image'
import { AuthLink, ChatLink } from '~/components/ReusableLinks'
import { getServerAuthSession } from '~/server/auth'

export default async function RootLayoutTopBar() {
	const session = await getServerAuthSession()

	return (
		<header className="sticky top-0 z-10 flex items-center border-b border-white/20 bg-base-100">
			<Link href="/">
				<h1 className="px-4 py-2 font-serif text-2xl font-semibold italic">
					Cosmos Calendar
				</h1>
			</Link>

			<section className="ml-auto flex items-center">
				<div className="dropdown dropdown-end mx-4 my-1 sm:hidden">
					<label tabIndex={0} className="btn btn-circle m-1">
						<Image src="/assets/bars-3.svg" alt="menu" width={32} height={32} />
					</label>
					<ul
						tabIndex={0}
						className="menu dropdown-content rounded-box z-[1] w-52 border border-white/20 bg-secondary-950 p-2 text-lg"
					>
						{session?.user && (
							<>
								<li className="py-1">
									<Link className="p-0" href="/">
										Home
									</Link>
								</li>
								<li className="py-1">
									<ChatLink className="p-0">Chats</ChatLink>
								</li>
								<li className="py-1">Calendar</li>
								<li className="py-1">Notifications</li>
							</>
						)}
						<li className="py-1">
							<AuthLink className="p-0" />
						</li>
					</ul>
				</div>

				{session?.user && (
					<ul className="flex max-sm:hidden">
						<li>
							<Link href="/" className="tooltip tooltip-bottom" data-tip="Home">
								<Image
									className="btn btn-square btn-md p-2 hover:bg-white/20"
									src="/assets/home.svg"
									height={32}
									width={32}
									alt="home"
								/>
							</Link>
						</li>
						<li>
							<ChatLink className="tooltip tooltip-bottom" data-tip="Chats">
								<Image
									className="btn btn-square btn-md p-2 hover:bg-white/20"
									src="/assets/chat-bubble-left-right.svg"
									height={32}
									width={32}
									alt="chats"
								/>
							</ChatLink>
						</li>
						<li>
							<span className="tooltip tooltip-bottom" data-tip="Calendar">
								<Image
									className="btn btn-square btn-md p-2 hover:bg-white/20"
									src="/assets/calendar.svg"
									height={32}
									width={32}
									alt="calendar"
								/>
							</span>
						</li>
						<li>
							<span className="tooltip tooltip-bottom" data-tip="Notifications">
								<Image
									className="btn btn-square btn-md p-2 hover:bg-white/20"
									src="/assets/bell.svg"
									height={32}
									width={32}
									alt="notifications"
								/>
							</span>
						</li>
					</ul>
				)}
				<AuthLink
					className={`btn btn-md mx-4 my-2 max-sm:hidden 
                ${
					session?.user
						? 'text-red-600 hover:bg-primary-900 hover:text-white'
						: 'btn-secondary'
				}`}
				/>
			</section>
		</header>
	)
}
