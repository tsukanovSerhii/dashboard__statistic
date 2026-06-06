import { Search } from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import { Input } from '../ui/Input'

type Props = {
	user: {
		name: string
		imgSrc: string
	}
}

export const Topbar = ({ user }: Props) => {
	return (
		<header className="flex min-h-16 items-center justify-between border-b border-light-gray/20 px-6 py-5.5">
			<div className="flex flex-col gap-2">
				<h4 className="text-xl font-semibold leading-7">
					Welcome back, {user.name.split(' ')[0]}!
				</h4>
				<p className="text-sm text-light-gray">
					{new Date().toLocaleDateString()}
				</p>
			</div>
			<div className="flex items-center gap-3">
				<Input
					iconLeft={Search}
					placeholder="Search..."
					wrapperClassName="w-90 border-light-gray/20"
				/>
				<Avatar
					name={user.name}
					src={user.imgSrc || null}
				/>
			</div>
		</header>
	)
}
