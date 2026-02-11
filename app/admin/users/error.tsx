"use client";

export default function AdminUsersError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
			<p className="font-semibold">Something went wrong.</p>
			<p className="mt-1 text-sm">{error.message || "Please try again."}</p>
			<button
				type="button"
				onClick={() => reset()}
				className="mt-3 rounded-md bg-red-600 px-3 py-1 text-sm text-white"
			>
				Try again
			</button>
		</div>
	);
}
