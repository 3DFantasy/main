import { useState } from 'react'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/navbar'
import {
	Avatar,
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Link,
} from '@nextui-org/react'

import type { Account } from '@prisma/client'

export type MenuItem = { label: string; key: string; to: any }

export type HeaderInput = {
	account: Account | null
}

export function Header({ account }: HeaderInput) {
	const loggedOutMenuItems: MenuItem[] = [
		{ label: 'Sign Up', key: 'sign-up', to: '/auth/signup' },
		{ label: 'Log In', key: 'log-in', to: '/auth/login' },
	]

	const loggedInMenuItems: MenuItem[] = [
		{ label: 'Profile', key: 'profile', to: '/profile' },
		{ label: 'Dashboard', key: 'dashboard', to: '/dashboard' },
		{ label: 'Log Out', key: 'log-out', to: '/auth/logout' },
	]

	return (
		<Navbar isBordered>
			<NavbarContent>
				<NavbarBrand>
					<p className='font-bold text-inherit'>3DF</p>
				</NavbarBrand>
			</NavbarContent>

			<NavbarContent className='hidden sm:flex gap-4' justify='center'>
				{/* <NavbarItem>
					<Link color='foreground' href='#'>
						Features
					</Link>
				</NavbarItem>
				<NavbarItem isActive>
					<Link href='#' aria-current='page'>
						Customers
					</Link>
				</NavbarItem>
				<NavbarItem>
					<Link color='foreground' href='#'>
						Integrations
					</Link>
				</NavbarItem> */}
			</NavbarContent>
			<NavbarContent as='div' justify='end'>
				{account ? (
					<Dropdown placement='bottom-end'>
						<DropdownTrigger>
							<Avatar
								isBordered
								as='button'
								className='transition-transform'
								color='secondary'
								// name='Jason Hughes'
								size='sm'
								// src='https://i.pravatar.cc/150?u=a042581f4e29026704d'
							/>
						</DropdownTrigger>

						<DropdownMenu aria-label='Profile Actions' variant='flat'>
							{loggedInMenuItems.map((item, i) => {
								return (
									<DropdownItem key={item.key}>
										{' '}
										<Link
											className='w-full'
											// color={i === 0 ? 'default' : i === 1 ? 'primary' : 'secondary'}
											href={item.to}
											// variant='flat'
										>
											{item.label}
										</Link>
									</DropdownItem>
								)
							})}
						</DropdownMenu>
					</Dropdown>
				) : (
					loggedOutMenuItems.map((item, i) => {
						return (
							<NavbarItem key={i}>
								<Button
									as={Link}
									color={i === 0 ? 'default' : i === 1 ? 'primary' : 'secondary'}
									href={item.to}
									variant='flat'
								>
									{item.label}
								</Button>
							</NavbarItem>
						)
					})
				)}
			</NavbarContent>
		</Navbar>
	)
}
