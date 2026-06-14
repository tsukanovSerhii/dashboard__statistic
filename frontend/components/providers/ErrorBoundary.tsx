'use client'

import { Component, ErrorInfo, ReactNode } from 'react'

type Props = { children: ReactNode; fallback?: ReactNode }
type State = { hasError: boolean; message: string }

export class ErrorBoundary extends Component<Props, State> {
	state: State = { hasError: false, message: '' }

	static getDerivedStateFromError(err: Error): State {
		return { hasError: true, message: err.message }
	}

	componentDidCatch(err: Error, info: ErrorInfo) {
		console.error('[ErrorBoundary]', err, info)
	}

	reset = () => this.setState({ hasError: false, message: '' })

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) return this.props.fallback
			return (
				<div className="flex flex-col items-center gap-4 rounded-2xl border border-error/20 bg-error/5 p-10 text-center">
					<p className="text-sm font-semibold text-error">Something went wrong</p>
					{this.state.message && (
						<p className="max-w-sm text-xs text-light-gray">{this.state.message}</p>
					)}
					<button
						type="button"
						onClick={this.reset}
						className="rounded-xl border border-error/30 px-4 py-1.5 text-xs text-error transition-colors hover:bg-error/10"
					>
						Try again
					</button>
				</div>
			)
		}
		return this.props.children
	}
}
