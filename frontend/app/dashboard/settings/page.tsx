'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { changePassword, deleteAccount } from '@/lib/api/auth'
import { useAuthStore } from '@/lib/stores/auth.store'
import axios from 'axios'
import { TriangleAlert } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { SettingsCard } from './SettingsCard'

export default function SettingsPage() {
	const user = useAuthStore(state => state.user)
	const [currentPassword, setCurrentPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [error, setError] = useState<string | null>(null)

	const router = useRouter()

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault()
		setError(null)

		// inline validation stays next to the form
		if (newPassword !== confirmPassword) {
			return setError("Passwords don't match")
		}
		if (newPassword.length < 6) {
			return setError('Password must be at least 6 characters')
		}
		try {
			await changePassword(currentPassword, newPassword)
			toast.success('Password updated')
			setCurrentPassword('')
			setNewPassword('')
			setConfirmPassword('')
		} catch (err) {
			const message = axios.isAxiosError(err)
				? (err.response?.data?.error ?? 'Failed to update password')
				: 'Something went wrong'
			setError(message)
		}
	}

	const handleDeleteAccount = async () => {
		if (!confirm('Delete your account? This cannot be undone.')) return
		try {
			await deleteAccount()
			toast.success('Account deleted')
			router.replace('/login')
		} catch {
			toast.error('Failed to delete account')
		}
	}

	return (
		<div className="animate-fade-up mx-auto flex w-full max-w-2xl flex-col gap-6">
			<div>
				<h1 className="text-2xl font-semibold">Settings</h1>
				<p className="mt-1 text-sm text-light-gray">
					Manage your account and preferences
				</p>
			</div>

			{/* profile */}
			<SettingsCard
				title="Profile"
				description="Your account information"
			>
				<Input
					label="Email"
					type="email"
					value={user?.email ?? ''}
					readOnly
					disabled
				/>
			</SettingsCard>

			{/* change password */}
			<SettingsCard
				title="Change password"
				description="Update your password. You'll stay signed in."
			>
				<form
					className="flex flex-col gap-4"
					onSubmit={handleSubmit}
				>
					<Input
						value={currentPassword}
						onChange={e => setCurrentPassword(e.target.value)}
						label="Current password"
						type="password"
						placeholder="••••••••"
						autoComplete="current-password"
					/>
					<Input
						value={newPassword}
						onChange={e => setNewPassword(e.target.value)}
						label="New password"
						type="password"
						placeholder="At least 6 characters"
						autoComplete="new-password"
						hint="Use at least 6 characters"
					/>
					<Input
						value={confirmPassword}
						onChange={e => setConfirmPassword(e.target.value)}
						label="Confirm new password"
						type="password"
						placeholder="••••••••"
						autoComplete="new-password"
					/>
					{error && (
						<div className="flex items-center gap-2 rounded-lg bg-error/10 px-3 py-2.5 text-sm text-error">
							<TriangleAlert
								size={16}
								className="shrink-0"
							/>
							{error}
						</div>
					)}

					<div className="flex justify-end">
						<Button
							type="submit"
							className="rounded-lg"
						>
							Update password
						</Button>
					</div>
				</form>
			</SettingsCard>

			{/* danger zone */}
			<div className="rounded-xl border border-error/30 bg-error/5 p-6">
				<h2 className="text-lg font-semibold text-error">Danger zone</h2>
				<p className="mt-1 text-sm text-light-gray">
					Deleting your account is permanent and removes all your datasets.
				</p>
				<div className="mt-5 flex justify-end">
					<button
						onClick={handleDeleteAccount}
						type="button"
						className="cursor-pointer rounded-lg bg-error px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-error/90"
					>
						Delete account
					</button>
				</div>
			</div>
		</div>
	)
}
