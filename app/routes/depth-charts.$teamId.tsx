import { Card, Link } from '@heroui/react'
import { Outlet, useLoaderData, useLocation, useOutletContext } from 'react-router'
import { depthChartsTeamIdLoader } from '~/loader/depthCharts.teamId.server'

import type { Route } from './+types/depth-charts.$teamId'
import type { LoaderData } from '~/loader/depthCharts.teamId.server'
import type { DepthChartsContext } from '~/routes/depth-charts'

export const meta: Route.MetaFunction = () => {
    return [
        { title: '3DF - Team' },
        {
            name: '3DF/depth-charts/team',
            content: 'Team page for 3DFantasy application',
        },
    ]
}

export async function loader({ request }: Route.LoaderArgs) {
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
                    <Card.Content>
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
                    </Card.Content>
                </Card>
            ) : (
                <Outlet context={{ breadcrumbArray, activeTeamId, filter }} />
            )}
        </div>
    )
}
