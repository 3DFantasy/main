// import { settingsAccountLoader } from '~/loader/settings.server'

import { Divider } from '@heroui/react'
import type { MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => {
	return [
		{ title: '3DF - Account Settings' },
		{ name: '3DF', content: 'Modify your 3DF account application settings' },
	]
}

// export const loader: LoaderFunction = async ({ request }) => {
//   return settingsAccountLoader(request)
// }

export default function SettingsAccount() {
	return (
		<div>
			<h3 className='mb-4'>Profile</h3>
			<p>(coming soon)</p>
			<Divider className='my-4' />
			<h3 className='mb-4'>Account</h3>
		</div>
	)
}
