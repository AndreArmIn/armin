'use client'

import { useState, useEffect, useCallback } from 'react'
import { Package, Plus } from 'lucide-react'
import EquipmentForm from '@/components/forms/EquipmentForm'

const CATEGORY_LABELS: Record<string, string> = {
    ProtectiveGear: 'Equipaggiamento Protettivo',
    Optics: 'Ottica e Visori',
    Communications: 'Comunicazioni',
    Vehicles: 'Veicoli Leggeri',
    MedicalSupplies: 'Forniture Mediche',
    Clothing: 'Abbigliamento Militare',
    Tools: 'Attrezzatura e Strumenti',
    Other: 'Altro',
}

const STATUS_LABELS: Record<string, { label: string; badge: string }> = {
    Available: { label: 'Disponibile', badge: 'badge-green' },
    Deployed: { label: 'Dispiegato', badge: 'badge-blue' },
    UnderMaintenance: { label: 'In Manutenzione', badge: 'badge-yellow' },
    Retired: { label: 'Ritirato', badge: 'badge-gray' },
}

export default function EquipmentPage() {
    const [equipment, setEquipment] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [search, setSearch] = useState('')
    const [filterCategory, setFilterCategory] = useState('')

    const fetchEquipment = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (filterCategory) params.set('category', filterCategory)
            const res = await fetch(`/api/equipment?${params}`)
            const data = await res.json()
            setEquipment(Array.isArray(data) ? data : [])
        } catch {
            setEquipment([])
        } finally {
            setLoading(false)
        }
    }, [filterCategory])

    useEffect(() => {
        fetchEquipment()
    }, [fetchEquipment])

    const filtered = equipment.filter(
        (e) =>
            e.name.toLowerCase().includes(search.toLowerCase()) ||
            (e.brand && e.brand.toLowerCase().includes(search.toLowerCase()))
    )

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Equipaggiamento Militare</h1>
                    <p className="page-subtitle">Forniture e materiali non letali</p>
                </div>
                <button onClick={() => setShowForm(true)} className="btn-primary">
                    <Plus className="w-4 h-4" />
                    Registra Equipaggiamento
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <input
                    className="input max-w-xs"
                    placeholder="Cerca per nome o marca..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    className="select w-56"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                >
                    <option value="">Tutte le categorie</option>
                    {Object.entries(CATEGORY_LABELS).map(([v, label]) => (
                        <option key={v} value={v}>{label}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            {loading ? (
                <div className="card animate-pulse space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-10 bg-steel-700 rounded" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="card text-center py-16">
                    <Package className="w-12 h-12 text-steel-600 mx-auto mb-3" />
                    <p className="text-steel-400 font-medium">Nessun equipaggiamento trovato</p>
                    <p className="text-steel-600 text-sm mt-1">
                        {search || filterCategory
                            ? 'Prova a modificare i filtri'
                            : 'Registra il primo equipaggiamento'}
                    </p>
                    {!search && !filterCategory && (
                        <button onClick={() => setShowForm(true)} className="btn-primary mt-4 mx-auto">
                            <Plus className="w-4 h-4" />
                            Registra Equipaggiamento
                        </button>
                    )}
                </div>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Categoria</th>
                                <th>Marca</th>
                                <th>N° Serie</th>
                                <th>Quantità</th>
                                <th>Stato</th>
                                <th>Registrato il</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((eq) => {
                                const statusCfg = STATUS_LABELS[eq.status] || { label: eq.status, badge: 'badge-gray' }
                                return (
                                    <tr key={eq.id}>
                                        <td>
                                            <div>
                                                <p className="font-medium text-steel-100">{eq.name}</p>
                                                {eq.description && (
                                                    <p className="text-xs text-steel-500 truncate max-w-xs">{eq.description}</p>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge-gray">
                                                {CATEGORY_LABELS[eq.category] || eq.category}
                                            </span>
                                        </td>
                                        <td className="text-steel-300">{eq.brand || '—'}</td>
                                        <td>
                                            {eq.serialNumber ? (
                                                <span className="font-mono text-xs text-military-300 bg-military-900/30 px-2 py-0.5 rounded">
                                                    {eq.serialNumber}
                                                </span>
                                            ) : '—'}
                                        </td>
                                        <td>
                                            <span className="font-semibold text-steel-100">{eq.quantity.toLocaleString('it-IT')}</span>
                                        </td>
                                        <td>
                                            <span className={statusCfg.badge}>{statusCfg.label}</span>
                                        </td>
                                        <td className="text-steel-500 text-xs">
                                            {new Intl.DateTimeFormat('it-IT').format(new Date(eq.createdAt))}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {showForm && (
                <EquipmentForm
                    onClose={() => setShowForm(false)}
                    onSuccess={fetchEquipment}
                />
            )}
        </div>
    )
}
