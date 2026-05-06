import {
    BreadcrumbItem,
    Breadcrumbs,
    Card,
    CardBody,
    Input,
    Link,
} from '@heroui/react'
import { Outlet, useLoaderData, useLocation, useParams } from '@remix-run/react'
import { useEffect, useMemo, useState } from 'react'
import { depthChartsLoader } from '~/loader/depthCharts.server'

import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import type { LoaderData } from '~/loader/depthCharts.server'

export const meta: MetaFunction = () => {
    return [
        { title: '3DF - Depth Charts' },
        {
            name: '3DF/depth-charts',
            content: 'Depth charts page for 3DFantasy application',
        },
    ]
}

export const loader: LoaderFunction = async ({ request }) => {
    return depthChartsLoader(request)
}

export type BreadCrumbObj = {
    path: string
    title: string
}

export type DepthChartsContext = {
    breadcrumbArray: BreadCrumbObj[]
    activeTeamId: number | null
    filter: string
}

function matchesFilter(value: string, filter: string) {
    return value.toLowerCase().includes(filter.trim().toLowerCase())
}

export default function DepthCharts() {
    const location = useLocation()
    const params = useParams()
    const [filter, setFilter] = useState('')
    const { teams } = useLoaderData<LoaderData>()

    const activeTeam = params.teamId
        ? (teams.find((t) => t.uuid === params.teamId) ?? null)
        : null
    const activeTeamId = activeTeam?.id ?? null

    const breadcrumbArray = useMemo<BreadCrumbObj[]>(() => {
        const segments = location.pathname
            .split('/')
            .filter((segment) => segment.length > 0)
        const result: BreadCrumbObj[] = []

        let currentPath = ''
        for (let i = 0; i < segments.length; i++) {
            const segment = segments[i]
            currentPath += '/' + segment

            let title: string
            if (i === 0) {
                title = 'Depth Charts'
            } else if (i === 1) {
                const team = teams.find((t) => t.uuid === segment)
                title = team ? team.title : 'N/A'
            } else {
                title =
                    segment.charAt(0).toUpperCase() +
                    segment.slice(1).replace(/-/g, ' ')
            }

            result.push({ path: currentPath, title })
        }

        return result
    }, [location.pathname, teams])

    useEffect(() => {
        setFilter('')
    }, [location.pathname])

    const filteredTeams = teams.filter(
        (team) =>
            matchesFilter(team.title, filter) ||
            matchesFilter(team.abbr ?? '', filter)
    )

    return (
        <div
            className={`my-2 ${activeTeamId ? `team-${activeTeamId}` : ''}`}
        >
            <Breadcrumbs>
                {breadcrumbArray.map((breadcrumb, i) => {
                    return (
                        <BreadcrumbItem key={i} href={breadcrumb.path}>
                            {breadcrumb.title}
                        </BreadcrumbItem>
                    )
                })}
            </Breadcrumbs>

            <Input
                value={filter}
                onValueChange={setFilter}
                placeholder="Filter..."
                isClearable
                onClear={() => setFilter('')}
                startContent={
                    <i className="ri-search-line text-foreground/40" />
                }
                className="mt-4"
            />

            {breadcrumbArray.length === 1 ? (
                <Card className="mt-4">
                    <CardBody>
                        <div className="flex flex-col items-start gap-3">
                            {filteredTeams.map((team) => {
                                const href = `/depth-charts/${team.uuid}`
                                return (
                                    <Link
                                        key={team.uuid}
                                        href={href}
                                        title={team.title}
                                        className={`team-${team.id} team-button`}
                                    >
                                        {team.abbr}
                                    </Link>
                                )
                            })}
                            {filteredTeams.length === 0 && (
                                <p className="text-foreground/50 text-sm">
                                    No teams match "{filter}".
                                </p>
                            )}
                        </div>
                    </CardBody>
                </Card>
            ) : (
                <Outlet
                    context={{ breadcrumbArray, activeTeamId, filter }}
                />
            )}
        </div>
    )
}
