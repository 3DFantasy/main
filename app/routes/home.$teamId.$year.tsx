import { Link } from '@heroui/react'
import { Outlet, useLoaderData, useOutletContext } from '@remix-run/react'
import {
    homeTeamIdYearLoader,
    LoaderData,
} from '~/loader/home.teamId.year.server'
import { HomeContext } from '~/routes/home'

import type { LoaderFunction, MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => {
    return [
        { title: '3DF - Year' },
        {
            name: '3DF/home/team/year',
            content: 'Team year page for 3DFantasy application',
        },
    ]
}

export const loader: LoaderFunction = async ({ request, params }) => {
    return homeTeamIdYearLoader(request, params)
}

export default function HomeTeamIdYear() {
    const { depthCharts } = useLoaderData<LoaderData>()
    const { breadcrumbArray } = useOutletContext<HomeContext>()

    return (
        <div>
            <h2 className="my-2">Depth Charts</h2>
            {breadcrumbArray.length === 3 ? (
                <ul>
                    {depthCharts.map((depthChart) => {
                        return (
                            <li>
                                <Link target="_blank" href={depthChart.value}>
                                    {depthChart.title}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            ) : (
                <Outlet />
            )}
        </div>
    )
}
