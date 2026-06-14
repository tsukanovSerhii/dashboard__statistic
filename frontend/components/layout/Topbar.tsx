import { User } from '@/types'
import { Avatar } from '../ui/Avatar'

type Props = {
	user: User
}

// e.g. "Saturday, Jun 14, 2026"
const today = () =>
	new Date().toLocaleDateString('en-US', {
		weekday: 'long',
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	})

export const Topbar = ({ user }: Props) => {
	return (
		<header className="flex min-h-16 items-center justify-between border-b border-light-gray/20 px-6 py-5.5">
			<div className="flex flex-col gap-1">
				<h4 className="text-xl font-semibold leading-7">
					Welcome back, {user.name.split(' ')[0]}!
				</h4>
				<p className="text-sm text-light-gray">{today()}</p>
			</div>
			<Avatar
				name={user.name}
				src={user.imgSrc || null}
			/>
		</header>
	)
}
