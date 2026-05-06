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
    const { breadcrumbArray, activeTeamId, filter } =
        useOutletContext<DepthChartsContext>()

    const filteredYears = years.filter((year) =>
        year.toString().includes(filter.trim())
    )

    return (
        <div>
            {breadcrumbArray.length === 2 ? (
                <Card className="mt-4">
                    <CardBody>
                        <div className="flex flex-col items-start gap-3">
                            {filteredYears.map((year) => {
                                const yearStr = year.toString()
                                const href = `${location.pathname}/${yearStr}`
                                return (
                                    <Link
                                        key={yearStr}
                                        href={href}
                                        className="team-button"
                                    >
                                        {yearStr}
                                    </Link>
                                )
                            })}
                            {filteredYears.length === 0 && (
                                <p className="text-foreground/50 text-sm">
                                    No years match "{filter}".
                                </p>
                            )}
                        </div>
                    </CardBody>
                </Card>
            ) : (
                <Outlet context={{ breadcrumbArray, activeTeamId, filter }} />
            )}
        </div>
    )
}
