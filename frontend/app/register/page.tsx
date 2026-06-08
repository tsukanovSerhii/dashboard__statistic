'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { register } from '@/lib/api/auth'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function RegisterPage() {
	const router = useRouter()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)
		setLoading(true)
		try {
			await register(email, password)
			router.push('/dashboard')
		} catch (err) {
			if (axios.isAxiosError(err)) {
				setError(err.response?.data?.error ?? 'Registration failed')
			} else {
				setError('Something went wrong')
			}
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center p-6">
			<form
				onSubmit={handleSubmit}
				className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-light-gray/20 bg-surface p-8"
			>
				<h1 className="text-2xl font-semibold">Create account</h1>

				{error && (
					<p className="rounded-lg bg-error/10 px-3 py-2 text-sm text-error">
						{error}
					</p>
				)}

				<Input
					label="Email"
					type="email"
					placeholder="you@example.com"
					value={email}
					onChange={e => setEmail(e.target.value)}
					required
				/>
				<Input
					label="Password"
					type="password"
					placeholder="At least 8 characters"
					value={password}
					onChange={e => setPassword(e.target.value)}
					required
				/>

				<Button
					type="submit"
					disable={loading}
					className="mt-2 w-full rounded-lg"
				>
					{loading ? 'Creating…' : 'Create account'}
				</Button>

				<p className="text-center text-sm text-light-gray">
					Already have an account?{' '}
					<Link href="/login" className="text-primary">
						Sign in
					</Link>
				</p>
			</form>
		</div>
	)
}
