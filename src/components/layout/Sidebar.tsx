'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Globe,
    Crosshair,
    Package,
    ArrowLeftRight,
    ChevronRight,
    Shield,
    BookOpen,
} from 'lucide-react'

const navItems = [
    {
        label: 'Dashboard',
        href: '/',
        icon: LayoutDashboard,
    },
    {
        label: 'Governi',
        href: '/governments',
        icon: Globe,
    },
    {
        label: 'Armi',
        href: '/weapons',
        icon: Crosshair,
    },
    {
        label: 'Equipaggiamento',
        href: '/equipment',
        icon: Package,
    },
    {
        label: 'Transazioni',
        href: '/transactions',
        icon: ArrowLeftRight,
    },
    {
        label: 'Catalogo',
        href: '/catalog',
        icon: BookOpen,
    },
]

export default function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-64 bg-steel-900 border-r border-steel-700 flex flex-col shrink-0">
            {/* Logo */}
            <div className="p-5 border-b border-steel-700">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-military-700 flex items-center justify-center shadow-lg glow-green">
                        <Shield className="w-5 h-5 text-military-200" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-steel-50 tracking-tight">ArmIn</h1>
                        <p className="text-[10px] text-steel-500 uppercase tracking-widest font-medium">Defense Management</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
                <p className="text-[10px] font-semibold text-steel-600 uppercase tracking-widest px-3 py-2 mt-1">
                    Navigazione
                </p>
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== '/' && pathname.startsWith(item.href))
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={isActive ? 'nav-link-active' : 'nav-link-inactive'}
                        >
                            <Icon className="w-4 h-4 shrink-0" />
                            <span className="flex-1">{item.label}</span>
                            {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-steel-700">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-7 h-7 rounded-full bg-military-700 flex items-center justify-center text-xs font-bold text-military-200">
                        A
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-steel-200 truncate">Admin</p>
                        <p className="text-[10px] text-steel-500 truncate">admin@armin.gov</p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-success-500 shrink-0" title="Online" />
                </div>
            </div>
        </aside>
    )
}
