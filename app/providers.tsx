import { RouterProvider, toast, ToastProvider } from '@heroui/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'

import type { ReactNode } from 'react'
import type { RootContextAccount } from './root'

const AuthContext = createContext<{
    account: RootContextAccount | null
    setAccount: (account: RootContextAccount | null) => void
    logout: () => void
}>(null!)

export const useAuth = () => useContext(AuthContext)

export function Providers({
    children,
    initialAccount,
}: {
    children: ReactNode
    initialAccount: RootContextAccount | null
}) {
    const navigate = useNavigate()
    const loggedIn = useRef(false)
    const [account, setAccount] = useState<RootContextAccount | null>(
        initialAccount
    )

    const logout = () => {
        if (account) {
            toast(`User Signed out: `, {
                description: account.email,
            })
            setAccount(null)
            loggedIn.current = false
            navigate('/auth/logout')
        }
    }

    useEffect(() => {
        if (!loggedIn.current && account) {
            toast('Authenticated:', {
                description: account.email,
            })
            loggedIn.current = true
        }
    }, [account, loggedIn])

    return (
        <AuthContext.Provider value={{ account, setAccount, logout }}>
            <RouterProvider navigate={navigate}>
                <NextThemesProvider attribute="class" defaultTheme="dark">
                    <ToastProvider placement="bottom" />
                    {children}
                </NextThemesProvider>
            </RouterProvider>
        </AuthContext.Provider>
    )
}
