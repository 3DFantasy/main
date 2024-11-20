import { Card, CardBody } from '@nextui-org/react'
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
		<Card className={`max-w-fit toast ${!message ? 'hidden' : ''}`}>
			<CardBody className={error ? 'bg-danger' : 'bg-secondary'}>
				<p>{message}</p>
			</CardBody>
		</Card>
	)
}
