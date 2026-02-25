'use client'

import { useState, useEffect, useCallback } from 'react'
import { ArrowLeftRight, Plus } from 'lucide-react'
import TransactionForm from '@/components/forms/TransactionForm'

const TX_CONFIG: Record<string, { label: string; badge: string; emoji: string }> = {
    Sale: { label: 'Vendita', badge: 'badge-blue', emoji: '💰' },
    Delivery: { label: 'Consegna', badge: 'badge-green', emoji: '🚚' },
    Reception: { label: 'Ricezione', badge: 'badge-green', emoji: '✅' },
    Return: { label: 'Restituzione', badge: 'badge-yellow', emoji: '↩️' },
    Repair: { label: 'Riparazione', badge: 'badge-yellow', emoji: '🔧' },
    Replacement: { label: 'Sostituzione', badge: 'badge-gray', emoji: '🔄' },
    Destruction: { label: 'Distruzione', badge: 'badge-red', emoji: '💥' },
    Donation: { label: 'Donazione', badge: 'badge-green', emoji: '🎁' },
}

function formatCurrency(value: number, currency: string = 'USD') {
    return new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
    }).format(value)
}

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [filterType, setFilterType] = useState('')

    const fetchTransactions = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (filterType) params.set('type', filterType)
            const res = await fetch(`/api/transactions?${params}`)
            const data = await res.json()
            setTransactions(Array.isArray(data) ? data : [])
        } catch {
            setTransactions([])
        } finally {
            setLoading(false)
        }
    }, [filterType])

    useEffect(() => {
        fetchTransactions()
    }, [fetchTransactions])

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Registro Transazioni</h1>
                    <p className="page-subtitle">Storico completo di tutte le operazioni</p>
                </div>
                <button onClick={() => setShowForm(true)} className="btn-primary">
                    <Plus className="w-4 h-4" />
                    Nuova Operazione
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <select
                    className="select w-52"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option value="">Tutti i tipi</option>
                    {Object.entries(TX_CONFIG).map(([v, { label, emoji }]) => (
                        <option key={v} value={v}>{emoji} {label}</option>
                    ))}
                </select>
                {filterType && (
                    <button onClick={() => setFilterType('')} className="btn-ghost text-xs">
                        Reset
                    </button>
                )}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(TX_CONFIG).slice(0, 4).map(([type, cfg]) => {
                    const count = transactions.filter((t) => t.type === type).length
                    return (
                        <button
                            key={type}
                            onClick={() => setFilterType(filterType === type ? '' : type)}
                            className={`card text-left transition-all duration-200 hover:border-military-600 ${filterType === type ? 'border-military-500 bg-military-900/20' : ''
                                }`}
                        >
                            <p className="text-xs text-steel-500 mb-1">{cfg.emoji} {cfg.label}</p>
                            <p className="text-2xl font-bold text-steel-50">{count}</p>
                        </button>
                    )
                })}
            </div>

            {/* Table */}
            {loading ? (
                <div className="card animate-pulse space-y-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-12 bg-steel-700 rounded" />
                    ))}
                </div>
            ) : transactions.length === 0 ? (
                <div className="card text-center py-16">
                    <ArrowLeftRight className="w-12 h-12 text-steel-600 mx-auto mb-3" />
                    <p className="text-steel-400 font-medium">Nessuna transazione trovata</p>
                    <p className="text-steel-600 text-sm mt-1">
                        {filterType ? 'Prova a rimuovere il filtro' : 'Registra la prima operazione'}
                    </p>
                    {!filterType && (
                        <button onClick={() => setShowForm(true)} className="btn-primary mt-4 mx-auto">
                            <Plus className="w-4 h-4" />
                            Nuova Operazione
                        </button>
                    )}
                </div>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Tipo</th>
                                <th>Arma / Equipaggiamento</th>
                                <th>Da</th>
                                <th>A</th>
                                <th>Contratto</th>
                                <th>Valore</th>
                                <th>Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx) => {
                                const cfg = TX_CONFIG[tx.type] || { label: tx.type, badge: 'badge-gray', emoji: '•' }
                                return (
                                    <tr key={tx.id}>
                                        <td>
                                            <span className={cfg.badge}>
                                                {cfg.emoji} {cfg.label}
                                            </span>
                                        </td>
                                        <td>
                                            {tx.weapon ? (
                                                <div>
                                                    <p className="text-xs font-mono text-military-300">{tx.weapon.serialNumber}</p>
                                                    <p className="text-xs text-steel-500">{tx.weapon.weaponType?.name}</p>
                                                </div>
                                            ) : tx.equipment ? (
                                                <div>
                                                    <p className="text-xs text-steel-200">{tx.equipment.name}</p>
                                                    <p className="text-xs text-steel-500">x{tx.equipment.quantity}</p>
                                                </div>
                                            ) : (
                                                <span className="text-steel-600">—</span>
                                            )}
                                        </td>
                                        <td className="text-xs text-steel-400">
                                            {tx.fromGovernment
                                                ? `[${tx.fromGovernment.countryCode}] ${tx.fromGovernment.name}`
                                                : <span className="text-steel-600">Fornitore</span>}
                                        </td>
                                        <td className="text-xs text-steel-400">
                                            {tx.toGovernment
                                                ? `[${tx.toGovernment.countryCode}] ${tx.toGovernment.name}`
                                                : <span className="text-steel-600">—</span>}
                                        </td>
                                        <td>
                                            {tx.contractNumber ? (
                                                <span className="font-mono text-xs text-steel-400">{tx.contractNumber}</span>
                                            ) : (
                                                <span className="text-steel-600">—</span>
                                            )}
                                        </td>
                                        <td>
                                            {tx.value ? (
                                                <span className="text-sm font-semibold text-military-300">
                                                    {formatCurrency(tx.value, tx.currency)}
                                                </span>
                                            ) : (
                                                <span className="text-steel-600">—</span>
                                            )}
                                        </td>
                                        <td className="text-xs text-steel-500">
                                            {new Intl.DateTimeFormat('it-IT', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                            }).format(new Date(tx.timestamp))}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {showForm && (
                <TransactionForm
                    onClose={() => setShowForm(false)}
                    onSuccess={fetchTransactions}
                />
            )}
        </div>
    )
}
