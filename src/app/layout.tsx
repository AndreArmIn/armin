import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'

export const metadata: Metadata = {
    title: 'ArmIn — Military Arms & Equipment Management',
    description: 'Sistema di gestione per la vendita e il tracciamento di armi ed equipaggiamento militare per governi.',
    keywords: ['military', 'arms', 'equipment', 'government', 'defense', 'management'],
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="it" className="dark">
            <body>
                <div className="flex h-screen overflow-hidden">
                    <Sidebar />
                    <div className="flex flex-col flex-1 overflow-hidden">
                        <TopBar />
                        <main className="flex-1 overflow-y-auto p-6 animate-fade-in">
                            {children}
                        </main>
                    </div>
                </div>
            </body>
        </html>
    )
}
