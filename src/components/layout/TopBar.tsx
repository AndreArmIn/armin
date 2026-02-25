'use client'

import { usePathname } from 'next/navigation'
import { Bell, Search, Settings } from 'lucide-react'

const pageTitles: Record<string, { title: string; subtitle: string }> = {
    '/': { title: 'Dashboard', subtitle: 'Panoramica operativa globale' },
    '/governments': { title: 'Governi', subtitle: 'Gestione governi partner' },
    '/weapons': { title: 'Armi', subtitle: 'Registro armi e matricole' },
    '/equipment': { title: 'Equipaggiamento', subtitle: 'Forniture militari non letali' },
    '/transactions': { title: 'Transazioni', subtitle: 'Storico operazioni e contratti' },
    '/catalog': { title: 'Catalogo', subtitle: 'Tipologie armi per categoria e marca' },
}

export default function TopBar() {
    const pathname = usePathname()

    const getPageInfo = () => {
        for (const [path, info] of Object.entries(pageTitles)) {
            if (path === '/' && pathname === '/') return info
            if (path !== '/' && pathname.startsWith(path)) return info
        }
        return { title: 'ArmIn', subtitle: 'Defense Management System' }
    }

    const { title, subtitle } = getPageInfo()

    return (
        <header className="h-16 bg-steel-900/80 backdrop-blur-sm border-b border-steel-700 flex items-center justify-between px-6 shrink-0">
            <div>
                <h2 className="text-base font-semibold text-steel-50">{title}</h2>
                <p className="text-xs text-steel-500">{subtitle}</p>
            </div>

            <div className="flex items-center gap-2">
                {/* Search */}
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-steel-500" />
                    <input
                        type="text"
                        placeholder="Cerca..."
                        className="bg-steel-800 border border-steel-700 text-steel-200 text-sm rounded-lg pl-9 pr-4 py-2 w-52 focus:outline-none focus:ring-1 focus:ring-military-500 focus:border-transparent placeholder:text-steel-600 transition-all"
                    />
                </div>

                {/* Notifications */}
                <button className="relative btn-ghost p-2">
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-military-400 rounded-full" />
                </button>

                {/* Settings */}
                <button className="btn-ghost p-2">
                    <Settings className="w-4 h-4" />
                </button>

                {/* Status */}
                <div className="flex items-center gap-2 ml-2 pl-3 border-l border-steel-700">
                    <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse-slow" />
                    <span className="text-xs text-steel-400 font-medium">Sistema Operativo</span>
                </div>
            </div>
        </header>
    )
}
