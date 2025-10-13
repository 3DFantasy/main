import { indexLoader } from '~/loader/index.server'

import type { LoaderFunction, MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => {
    return [
        { title: '3DF' },
        {
            name: '3DF',
            content:
                'Welcome to the 3DFantasy application, learn a bit more about us here.',
        },
    ]
}

export const loader: LoaderFunction = async ({ request }) => {
    return indexLoader(request)
}

export default function Index() {
    return (
        <div>
            <p>index</p>
        </div>
    )
}
