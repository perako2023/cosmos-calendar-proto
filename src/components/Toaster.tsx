'use client'
import { toast, Toaster as RHT_Toaster, ToastBar } from 'react-hot-toast'

export default function Toaster() {
	return (
		<RHT_Toaster position="top-center" toastOptions={{ duration: 2000 }}>
			{(t) => (
				<ToastBar toast={t}>
					{({ icon, message }) => (
						<div
							className="flex items-center"
							onClick={() => t.type !== 'loading' && toast.dismiss(t.id)}
						>
							{icon}
							{message}
						</div>
					)}
				</ToastBar>
			)}
		</RHT_Toaster>
	)
}
