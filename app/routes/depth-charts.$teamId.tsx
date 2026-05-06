import { Card, CardBody, Link } from '@heroui/react'
import {
    Outlet,
    useLoaderData,
    useLocation,
    useOutletContext,
} from '@remix-run/react'
import { depthChartsTeamIdLoader } from '~/loader/depthCharts.teamId.server'

import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import type { LoaderData } from '~/loader/depthCharts.teamId.server'
import type { DepthChartsContext } from '~/routes/depth-charts'

export const meta: MetaFunction = () => {
    return [
        { title: '3DF - Team' },
        {
            name: '3DF/depth-charts/team',
            content: 'Team page for 3DFantasy application',
        },
    ]
}

export const loader: LoaderFunction = async ({ request }) => {
    return depthChartsTeamIdLoader(request)
}

export default function DepthChartsTeamId() {
    const location = useLocation()
    const { years } = useLoaderData<LoaderData>()
    const { breadcrumbArray } = useOutletContext<DepthChartsContext>()
    return (
        <div>
            {breadcrumbArray.length === 2 ? (
                <Card className="mt-4">
                    <CardBody>
                        <ul className="flex flex-col gap-2">
                            {years.map((year) => {
                                const yearStr = year.toString()
                                const href = `${location.pathname}/${yearStr}`

                                return (
                                    <li key={yearStr}>
                                        <Link href={href}>{yearStr}</Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </CardBody>
                </Card>
            ) : (
                <Outlet context={{ breadcrumbArray }} />
            )}
        </div>
    )
}
