import { Link } from '@heroui/react'
import {
    Outlet,
    useLoaderData,
    useLocation,
    useOutletContext,
} from '@remix-run/react'
import { homeTeamIdLoader } from '~/loader/home.teamId.server'

import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import type { LoaderData } from '~/loader/home.teamId.server'
import type { HomeContext } from '~/routes/home'

export const meta: MetaFunction = () => {
    return [
        { title: '3DF - Team' },
        {
            name: '3DF/home/team',
            content: 'Team page for 3DFantasy application',
        },
    ]
}

export const loader: LoaderFunction = async ({ request }) => {
    return homeTeamIdLoader(request)
}

export default function HomeTeamId() {
    const location = useLocation()
    const { years } = useLoaderData<LoaderData>()
    const { breadcrumbArray } = useOutletContext<HomeContext>()
    return (
        <div>
            {breadcrumbArray.length === 2 ? (
                <ul className="my-2">
                    {years.map((year) => {
                        const yearStr = year.toString()
                        const href = `${location.pathname}/${yearStr}`

                        return (
                            <li>
                                <Link href={href}>{yearStr}</Link>
                            </li>
                        )
                    })}
                </ul>
            ) : (
                <Outlet context={{ breadcrumbArray }} />
            )}
        </div>
    )
}
