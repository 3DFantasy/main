// import { settingsAccountLoader } from '~/loader/settings.server'

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
	return <p>account</p>
}
