import { BreadcrumbItem, Breadcrumbs, Link } from '@heroui/react'
import { Outlet, useLoaderData, useLocation, useNavigate } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { homeLoader } from '~/loader/home.server'
import { useAuth } from '~/providers'

import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import type { LoaderData } from '~/loader/home.server'

export const meta: MetaFunction = () => {
	return [{ title: '3DF - Home' }, { name: '3DF/home', content: 'Home page for 3DFantasy application' }]
}

export const loader: LoaderFunction = async ({ request }) => {
	return homeLoader(request)
}

export type BreadCrumbObj = {
	path: string
	title: string
}

export type HomeContext = {
	breadcrumbArray: BreadCrumbObj[]
}

export default function Home() {
	const navigate = useNavigate()
	const location = useLocation()
	const [breadcrumbArray, setBreadcrumbArray] = useState<BreadCrumbObj[]>([])
	const { account, nextUrl, teams } = useLoaderData<LoaderData>()
	const { account: authAccount, setAccount } = useAuth()

	useEffect(() => {
		if (!authAccount) {
			setAccount({
				id: account.id,
				email: account.email,
				role: account.role,
			})
		}
		if (nextUrl) {
			navigate(nextUrl)
		}
	}, [])

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
				title = 'Home'
			} else if (i === 1) {
				const team = teams.find((t) => t.uuid === segment)
				title = team ? team.title : 'N/A'
			} else {
				// For other segments, just capitalize and format the segment name
				title = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
			}

			result.push({ path: currentPath, title })
		}

		return result
	}

	return (
		<div className='my-2'>
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
				<ul className='my-2'>
					{teams.map((team) => {
						const href = `/home/${team.uuid}`
						return (
							<li>
								<Link href={href}>{team.title}</Link>
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
