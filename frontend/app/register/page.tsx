'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { register } from '@/lib/api/auth'
import axios from 'axios'
import { BarChart3, FileSearch, Shield, Zap } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const features = [
	{ icon: BarChart3, title: 'Column analytics', desc: 'Type detection, nulls, unique values' },
	{ icon: FileSearch, title: 'Content browser', desc: 'Search across all rows instantly' },
	{ icon: Zap, title: 'Instant parsing', desc: 'CSV, XLSX and JSON supported' },
	{ icon: Shield, title: 'Secure', desc: 'JWT auth with refresh tokens' },
]

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
		<div className="flex min-h-screen">
			{/* Left — branding panel */}
			<div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 lg:flex lg:w-[46%]">
				<div className="absolute inset-0 bg-dot-grid" />
				<div className="orb h-72 w-72 bg-white/10 -top-16 -left-16" />
				<div className="orb h-96 w-96 bg-blue-400/20 bottom-0 right-0" />

				<div className="relative z-10 flex items-center gap-2.5">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
						<BarChart3 size={18} className="text-white" />
					</div>
					<span className="text-lg font-semibold text-white">DataLens</span>
				</div>

				<div className="relative z-10 space-y-8">
					<div>
						<h2 className="text-3xl font-bold leading-tight text-white">
							Analyze data<br />in seconds
						</h2>
						<p className="mt-3 text-sm leading-relaxed text-blue-100">
							Create a free account and start exploring your datasets with powerful analytics tools.
						</p>
					</div>
					<div className="stagger grid gap-3">
						{features.map(f => (
							<div key={f.title} className="animate-fade-up flex items-start gap-3 rounded-xl bg-white/10 px-4 py-3">
								<div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/20">
									<f.icon size={14} className="text-white" />
								</div>
								<div>
									<p className="text-sm font-medium text-white">{f.title}</p>
									<p className="text-xs text-blue-200">{f.desc}</p>
								</div>
							</div>
						))}
					</div>
				</div>

				<p className="relative z-10 text-xs text-blue-200">© {new Date().getFullYear()} DataLens</p>
			</div>

			{/* Right — form */}
			<div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-12">
				<div className="w-full max-w-sm animate-fade-up">
					<div className="mb-8 flex items-center gap-2 lg:hidden">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
							<BarChart3 size={16} className="text-white" />
						</div>
						<span className="text-lg font-semibold">DataLens</span>
					</div>

					<h1 className="text-2xl font-bold">Create account</h1>
					<p className="mt-1 text-sm text-light-gray">Start analyzing your data today</p>

					<form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
						{error && (
							<div className="rounded-lg border border-error/20 bg-error/10 px-3 py-2.5 text-sm text-error">
								{error}
							</div>
						)}
						<Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
						<Input label="Password" type="password" placeholder="At least 6 characters" value={password} onChange={e => setPassword(e.target.value)} required />
						<Button type="submit" disabled={loading} className="mt-2 w-full">
							{loading ? 'Creating…' : 'Create account'}
						</Button>
					</form>

					<p className="mt-6 text-center text-sm text-light-gray">
						Already have an account?{' '}
						<Link href="/login" className="font-medium text-primary hover:underline">
							Sign in
						</Link>
					</p>
				</div>
			</div>
		</div>
	)
}
