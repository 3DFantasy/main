import { Avatar, Button, Link } from '@heroui/react'
import { useLocation } from 'react-router';
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { useAuth } from '~/providers'

type NavItem = {
    label: string
    href: string
    icon: string
    adminOnly?: boolean
}

const navItems: NavItem[] = [
    { label: 'Home', href: '/home', icon: 'ri-home-4-line' },
    {
        label: 'Depth Charts',
        href: '/depth-charts',
        icon: 'ri-list-ordered',
    },
    { label: 'Settings', href: '/settings', icon: 'ri-settings-3-line' },
    {
        label: 'Admin',
        href: '/admin',
        icon: 'ri-shield-line',
        adminOnly: true,
    },
]

function NavLinks({
    account,
    pathname,
    onNavigate,
}: {
    account: ReturnType<typeof useAuth>['account']
    pathname: string
    onNavigate?: () => void
}) {
    return (
        <nav className="flex flex-col gap-1 px-3">
            {navItems
                .filter(
                    (item) => !item.adminOnly || account?.role === 'ADMIN'
                )
                .map((item) => {
                    const isActive = pathname.startsWith(item.href)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onPress={onNavigate}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-foreground/60 hover:text-foreground hover:bg-content2'
                            }`}
                        >
                            <i className={`${item.icon} ri-lg`}></i>
                            {item.label}
                        </Link>
                    )
                })}
        </nav>
    )
}

function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const isDark = theme === 'dark'

    return (
        <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground/60 hover:text-foreground hover:bg-content2 transition-colors w-full"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            <i
                className={`${isDark ? 'ri-sun-line' : 'ri-moon-line'} ri-lg`}
            ></i>
            {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
    )
}

function UserSection({
    account,
    logout,
}: {
    account: ReturnType<typeof useAuth>['account']
    logout: () => void
}) {
    if (!account) {
        return (
            <div className="flex flex-col gap-2 px-3">
                <Button
                    as={Link}
                    href="/auth/login"
                    color="primary"
                    variant="flat"
                    size="sm"
                    className="w-full"
                >
                    Log In
                </Button>
                <Button
                    as={Link}
                    href="/auth/signup"
                    color="default"
                    variant="bordered"
                    size="sm"
                    className="w-full"
                >
                    Sign Up
                </Button>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-3 px-3">
            <Avatar size="sm" color="primary" />
            <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">
                    {account.email}
                </p>
            </div>
            <button
                onClick={logout}
                className="text-foreground/40 hover:text-danger transition-colors"
                title="Log out"
            >
                <i className="ri-logout-box-r-line ri-lg"></i>
            </button>
        </div>
    )
}

export function Sidebar() {
    const location = useLocation()
    const { account, logout } = useAuth()
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        setMobileOpen(false)
    }, [location.pathname])

    return (
        <>
            {/* Desktop sidebar */}
            <aside className="hidden md:flex flex-col sticky top-0 h-dvh w-64 shrink-0 border-r border-divider bg-content1">
                <div className="flex-1 py-4">
                    <NavLinks account={account} pathname={location.pathname} />
                </div>

                <div className="border-t border-divider py-4">
                    <div className="px-3 mb-3">
                        <ThemeToggle />
                    </div>
                    <UserSection account={account} logout={logout} />
                </div>
            </aside>

            {/* Mobile top bar */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between h-14 px-4 border-b border-divider bg-content1">
                <div className="flex items-center gap-2">
                </div>
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="text-foreground p-1"
                >
                    <i
                        className={`${mobileOpen ? 'ri-close-line' : 'ri-menu-line'} ri-xl`}
                    ></i>
                </button>
            </div>

            {/* Mobile overlay */}
            {mobileOpen && (
                <>
                    <button
                        type="button"
                        aria-label="Close menu"
                        className="md:hidden fixed inset-0 z-40 bg-black/50"
                        onClick={() => setMobileOpen(false)}
                    />
                    <aside className="md:hidden fixed top-14 left-0 bottom-0 z-50 w-64 flex flex-col bg-content1 border-r border-divider">
                        <div className="flex-1 py-4">
                            <NavLinks
                                account={account}
                                pathname={location.pathname}
                                onNavigate={() => setMobileOpen(false)}
                            />
                        </div>
                        <div className="border-t border-divider py-4">
                            <div className="px-3 mb-3">
                                <ThemeToggle />
                            </div>
                            <UserSection account={account} logout={logout} />
                        </div>
                    </aside>
                </>
            )}
        </>
    )
}
