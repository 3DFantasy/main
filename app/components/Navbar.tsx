import { useState } from 'react'
import {
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	NavbarMenuToggle,
	NavbarMenu,
	NavbarMenuItem,
} from '@nextui-org/navbar'
import {
	Avatar,
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Link,
} from '@nextui-org/react'

export type MenuItem = { label: string; key: string }

export function Header() {
	const [loggedIn] = useState(false)

	const loggedOutMenuItems: MenuItem[] = [
		{ label: 'Sign Up', key: 'sign-up' },
		{ label: 'Log In', key: 'log-in' },
		{ label: 'Log In2', key: 'log-in2' },
	]

	const loggedInMenuItems: MenuItem[] = [
		{ label: 'Profile', key: 'profile' },
		{ label: 'Dashboard', key: 'dashboard' },
		{ label: 'Log Out', key: 'log-out' },
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
				{loggedIn ? (
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
							{loggedInMenuItems.map((item) => {
								return <DropdownItem key={item.key}>{item.label}</DropdownItem>
							})}
						</DropdownMenu>
					</Dropdown>
				) : (
					loggedOutMenuItems.map((item, i) => {
						return (
							<NavbarItem>
								<Button
									as={Link}
									color={i === 0 ? 'default' : i === 1 ? 'primary' : 'secondary'}
									href='#'
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
