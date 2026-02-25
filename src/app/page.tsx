import { prisma } from '@/lib/prisma'
import {
    Globe,
    Crosshair,
    Package,
    ArrowLeftRight,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    Wrench,
    DollarSign,
    Activity,
} from 'lucide-react'
import Link from 'next/link'

async function getDashboardData() {
    try {
        const [
            totalGovernments,
            totalWeapons,
            totalEquipment,
            totalTransactions,
            weaponsByStatus,
            recentTransactions,
            transactionsByType,
            totalSalesValue,
        ] = await Promise.all([
            prisma.government.count(),
            prisma.weapon.count(),
            prisma.equipment.count(),
            prisma.transaction.count(),
            prisma.weapon.groupBy({ by: ['status'], _count: { status: true } }),
            prisma.transaction.findMany({
                take: 6,
                orderBy: { timestamp: 'desc' },
                include: {
                    weapon: { include: { weaponType: true } },
                    equipment: true,
                    fromGovernment: true,
                    toGovernment: true,
                },
            }),
            prisma.transaction.groupBy({ by: ['type'], _count: { type: true } }),
            prisma.transaction.aggregate({
                _sum: { value: true },
                where: { type: 'Sale' },
            }),
        ])

        return {
            totalGovernments,
            totalWeapons,
            totalEquipment,
            totalTransactions,
            weaponsByStatus,
            recentTransactions,
            transactionsByType,
            totalSalesValue: totalSalesValue._sum.value || 0,
        }
    } catch {
        return null
    }
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    Available: { label: 'Disponibili', color: 'text-success-400', icon: CheckCircle },
    Sold: { label: 'Vendute', color: 'text-accent-400', icon: TrendingUp },
    UnderRepair: { label: 'In Riparazione', color: 'text-warning-400', icon: Wrench },
    Destroyed: { label: 'Distrutte', color: 'text-danger-400', icon: AlertTriangle },
    Donated: { label: 'Donate', color: 'text-military-300', icon: Activity },
    Returned: { label: 'Restituite', color: 'text-steel-400', icon: Activity },
}

const txTypeConfig: Record<string, { label: string; badge: string }> = {
    Sale: { label: 'Vendita', badge: 'badge-blue' },
    Delivery: { label: 'Consegna', badge: 'badge-green' },
    Reception: { label: 'Ricezione', badge: 'badge-green' },
    Return: { label: 'Restituzione', badge: 'badge-yellow' },
    Repair: { label: 'Riparazione', badge: 'badge-yellow' },
    Replacement: { label: 'Sostituzione', badge: 'badge-gray' },
    Destruction: { label: 'Distruzione', badge: 'badge-red' },
    Donation: { label: 'Donazione', badge: 'badge-green' },
}

function formatCurrency(value: number) {
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
    if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
    return `$${value.toFixed(0)}`
}

function formatDate(date: Date) {
    return new Intl.DateTimeFormat('it-IT', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(date))
}

export default async function DashboardPage() {
    const data = await getDashboardData()

    if (!data) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <AlertTriangle className="w-12 h-12 text-warning-400 mx-auto mb-3" />
                    <p className="text-steel-300 font-medium">Database non configurato</p>
                    <p className="text-steel-500 text-sm mt-1">Configura le variabili d&apos;ambiente nel file .env</p>
                </div>
            </div>
        )
    }

    const statCards = [
        {
            label: 'Governi Partner',
            value: data.totalGovernments,
            icon: Globe,
            color: 'text-accent-400',
            bg: 'bg-accent-500/10',
            href: '/governments',
        },
        {
            label: 'Armi Registrate',
            value: data.totalWeapons,
            icon: Crosshair,
            color: 'text-military-300',
            bg: 'bg-military-700/20',
            href: '/weapons',
        },
        {
            label: 'Equipaggiamenti',
            value: data.totalEquipment,
            icon: Package,
            color: 'text-warning-400',
            bg: 'bg-warning-500/10',
            href: '/equipment',
        },
        {
            label: 'Transazioni',
            value: data.totalTransactions,
            icon: ArrowLeftRight,
            color: 'text-steel-300',
            bg: 'bg-steel-700/30',
            href: '/transactions',
        },
    ]

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="page-title">Panoramica Operativa</h1>
                    <p className="page-subtitle">Stato globale del sistema di gestione armamenti</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-military-900/40 border border-military-700/50 rounded-lg">
                    <DollarSign className="w-4 h-4 text-military-300" />
                    <span className="text-sm font-semibold text-military-200">
                        Valore Vendite: {formatCurrency(data.totalSalesValue)}
                    </span>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card) => {
                    const Icon = card.icon
                    return (
                        <Link key={card.label} href={card.href} className="card-hover group">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-medium text-steel-400 uppercase tracking-wider">{card.label}</p>
                                    <p className="text-3xl font-bold text-steel-50 mt-2">{card.value}</p>
                                </div>
                                <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                                    <Icon className={`w-5 h-5 ${card.color}`} />
                                </div>
                            </div>
                            <div className="mt-3 flex items-center gap-1 text-xs text-steel-500 group-hover:text-military-400 transition-colors">
                                <span>Visualizza tutti</span>
                                <span>→</span>
                            </div>
                        </Link>
                    )
                })}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Transactions */}
                <div className="lg:col-span-2 card">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="section-title mb-0">Transazioni Recenti</h2>
                        <Link href="/transactions" className="text-xs text-military-400 hover:text-military-300 transition-colors">
                            Vedi tutte →
                        </Link>
                    </div>
                    <div className="space-y-2">
                        {data.recentTransactions.length === 0 ? (
                            <p className="text-steel-500 text-sm text-center py-8">Nessuna transazione registrata</p>
                        ) : (
                            data.recentTransactions.map((tx) => {
                                const config = txTypeConfig[tx.type] || { label: tx.type, badge: 'badge-gray' }
                                return (
                                    <div
                                        key={tx.id}
                                        className="flex items-center gap-4 p-3 rounded-lg bg-steel-900/50 hover:bg-steel-900 transition-colors"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className={config.badge}>{config.label}</span>
                                                {tx.weapon && (
                                                    <span className="text-xs text-steel-300 font-mono truncate">
                                                        {tx.weapon.serialNumber}
                                                    </span>
                                                )}
                                                {tx.equipment && (
                                                    <span className="text-xs text-steel-300 truncate">{tx.equipment.name}</span>
                                                )}
                                            </div>
                                            <p className="text-xs text-steel-500 truncate">
                                                {tx.fromGovernment && `Da: ${tx.fromGovernment.name}`}
                                                {tx.fromGovernment && tx.toGovernment && ' → '}
                                                {tx.toGovernment && `A: ${tx.toGovernment.name}`}
                                                {!tx.fromGovernment && !tx.toGovernment && (tx.details || '—')}
                                            </p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            {tx.value && (
                                                <p className="text-xs font-semibold text-military-300">
                                                    {formatCurrency(tx.value)}
                                                </p>
                                            )}
                                            <p className="text-xs text-steel-600">{formatDate(tx.timestamp)}</p>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                    {/* Weapons by Status */}
                    <div className="card">
                        <h2 className="section-title">Stato Armi</h2>
                        <div className="space-y-3">
                            {data.weaponsByStatus.length === 0 ? (
                                <p className="text-steel-500 text-sm text-center py-4">Nessuna arma registrata</p>
                            ) : (
                                data.weaponsByStatus.map((item) => {
                                    const config = statusConfig[item.status] || {
                                        label: item.status,
                                        color: 'text-steel-400',
                                        icon: Activity,
                                    }
                                    const Icon = config.icon
                                    const percentage = data.totalWeapons > 0
                                        ? Math.round((item._count.status / data.totalWeapons) * 100)
                                        : 0

                                    return (
                                        <div key={item.status} className="flex items-center gap-3">
                                            <Icon className={`w-4 h-4 ${config.color} shrink-0`} />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs text-steel-300">{config.label}</span>
                                                    <span className="text-xs font-semibold text-steel-200">{item._count.status}</span>
                                                </div>
                                                <div className="h-1.5 bg-steel-700 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-military-600 rounded-full transition-all duration-500"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <span className="text-xs text-steel-500 w-8 text-right">{percentage}%</span>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>

                    {/* Transaction Types */}
                    <div className="card">
                        <h2 className="section-title">Operazioni per Tipo</h2>
                        <div className="space-y-2">
                            {data.transactionsByType.length === 0 ? (
                                <p className="text-steel-500 text-sm text-center py-4">Nessuna operazione</p>
                            ) : (
                                data.transactionsByType.map((item) => {
                                    const config = txTypeConfig[item.type] || { label: item.type, badge: 'badge-gray' }
                                    return (
                                        <div key={item.type} className="flex items-center justify-between py-1.5">
                                            <span className={config.badge}>{config.label}</span>
                                            <span className="text-sm font-semibold text-steel-200">{item._count.type}</span>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
                <h2 className="section-title">Azioni Rapide</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { label: 'Nuovo Governo', href: '/governments', icon: Globe, color: 'text-accent-400' },
                        { label: 'Nuova Arma', href: '/weapons', icon: Crosshair, color: 'text-military-300' },
                        { label: 'Nuovo Equipaggiamento', href: '/equipment', icon: Package, color: 'text-warning-400' },
                        { label: 'Nuova Transazione', href: '/transactions', icon: ArrowLeftRight, color: 'text-steel-300' },
                    ].map((action) => {
                        const Icon = action.icon
                        return (
                            <Link
                                key={action.label}
                                href={action.href}
                                className="flex items-center gap-3 p-3 rounded-lg bg-steel-900/50 hover:bg-steel-900 border border-steel-700 hover:border-steel-600 transition-all duration-200 group"
                            >
                                <Icon className={`w-4 h-4 ${action.color}`} />
                                <span className="text-sm text-steel-300 group-hover:text-steel-100 transition-colors">
                                    {action.label}
                                </span>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
