import { BreadcrumbItem, Breadcrumbs, Card, CardBody, Link } from '@heroui/react'
import { Outlet, useLoaderData, useLocation } from '@remix-run/react'
import { useEffect, useState } from 'react'
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
}

export default function DepthCharts() {
    const location = useLocation()
    const [breadcrumbArray, setBreadcrumbArray] = useState<BreadCrumbObj[]>([])
    const { teams } = useLoaderData<LoaderData>()

    useEffect(() => {
        if (location.pathname) {
            setBreadcrumbArray(createBreadcrumbArray(location.pathname))
        }
    }, [location.pathname])

    function createBreadcrumbArray(path: string): BreadCrumbObj[] {
        const segments = path.split('/').filter((segment) => segment.length > 0)
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
    }

    return (
        <div className="my-2">
            <Breadcrumbs>
                {breadcrumbArray.map((breadcrumb, i) => {
                    return (
                        <BreadcrumbItem key={i} href={breadcrumb.path}>
                            {breadcrumb.title}
                        </BreadcrumbItem>
                    )
                })}
            </Breadcrumbs>

            {breadcrumbArray.length === 1 ? (
                <Card className="mt-4">
                    <CardBody>
                        <ul className="flex flex-col gap-2">
                            {teams.map((team) => {
                                const href = `/depth-charts/${team.uuid}`
                                return (
                                    <li key={team.uuid}>
                                        <Link href={href}>{team.title}</Link>
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
