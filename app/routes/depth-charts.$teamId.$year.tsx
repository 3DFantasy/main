import { Card, CardBody, Link } from '@heroui/react'
import { Outlet, useLoaderData, useOutletContext } from '@remix-run/react'
import {
    depthChartsTeamIdYearLoader,
    LoaderData,
} from '~/loader/depthCharts.teamId.year.server'
import { DepthChartsContext } from '~/routes/depth-charts'

import type { LoaderFunction, MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => {
    return [
        { title: '3DF - Year' },
        {
            name: '3DF/depth-charts/team/year',
            content: 'Team year page for 3DFantasy application',
        },
    ]
}

export const loader: LoaderFunction = async ({ request, params }) => {
    return depthChartsTeamIdYearLoader(request, params)
}

export default function DepthChartsTeamIdYear() {
    const { depthCharts } = useLoaderData<LoaderData>()
    const { breadcrumbArray, filter } = useOutletContext<DepthChartsContext>()

    const filtered = depthCharts.filter((dc) =>
        dc.title.toLowerCase().includes(filter.trim().toLowerCase())
    )

    return (
        <div>
            {breadcrumbArray.length === 3 ? (
                <Card className="mt-4">
                    <CardBody>
                        <div className="flex flex-col items-start gap-3">
                            {filtered.map((depthChart) => {
                                return (
                                    <Link
                                        key={depthChart.value}
                                        target="_blank"
                                        href={depthChart.value}
                                        className="team-button"
                                    >
                                        {depthChart.title}
                                    </Link>
                                )
                            })}
                            {filtered.length === 0 && (
                                <p className="text-foreground/50 text-sm">
                                    No depth charts match "{filter}".
                                </p>
                            )}
                        </div>
                    </CardBody>
                </Card>
            ) : (
                <Outlet />
            )}
        </div>
    )
}
