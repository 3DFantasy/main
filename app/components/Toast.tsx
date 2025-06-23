import { Card, CardBody } from '@heroui/react'
import { useEffect } from 'react'
import { timeout } from '~/utils/index'

export type ToastInput = {
	message: null | string
	setToast: (e: any) => void
	error?: boolean
}

export function Toast(toast: ToastInput) {
	const { message, error, setToast } = toast

	useEffect(() => {
		if (message) {
			const handleTimeout = async () => {
				await timeout(4)
				setToast({
					error: false,
					message: null,
				})
			}

			handleTimeout()
		}
	}, [message])

	return (
		<Card
			className={`
        max-w-fit toast fixed bottom-4 mx-auto left-0 right-0 z-50
        transition-all duration-300 ease-in-out
        ${!message ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}
      `}
		>
			<CardBody className={error ? 'bg-danger' : 'bg-secondary'}>
				<p>{message}</p>
			</CardBody>
		</Card>
	)
}
