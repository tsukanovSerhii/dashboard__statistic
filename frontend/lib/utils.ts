import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatBytes = (bytes: number) => {
	if (bytes < 1024) return `${bytes} B`
	if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// '2026-06-01T10:00:00Z' → "Jun 1, 2026"
export const formatDate = (iso: string) =>
	new Date(iso).toLocaleDateString('en-US', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	})