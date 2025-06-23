import { HeroUIProvider } from '@heroui/react'
import { useNavigate } from '@remix-run/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { createContext, useContext, useEffect, useState } from 'react'

import type { ReactNode } from 'react'
import type { RootContextAccount } from './root'

// Create Auth Context
const AuthContext = createContext<{
	account: RootContextAccount | null
	setAccount: (account: RootContextAccount | null) => void
}>(null!)

export const useAuth = () => useContext(AuthContext)

export function Providers({
	children,
	rootAccount,
	setToast,
}: {
	children: ReactNode
	rootAccount: RootContextAccount | null
	setToast: React.Dispatch<React.SetStateAction<{ message: null | string; error?: boolean }>>
}) {
	const navigate = useNavigate()
	const [account, setAccount] = useState(rootAccount)

	useEffect(() => {
		console.log(account)
	}, [account])

	return (
		<AuthContext.Provider value={{ account, setAccount }}>
			<HeroUIProvider navigate={navigate}>
				<NextThemesProvider attribute='class' defaultTheme='dark'>
					{children}
				</NextThemesProvider>
			</HeroUIProvider>
		</AuthContext.Provider>
	)
}
