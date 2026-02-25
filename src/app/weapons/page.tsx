'use client'

import { useState, useEffect, useCallback } from 'react'
import { Crosshair, Plus, Filter } from 'lucide-react'
import WeaponForm from '@/components/forms/WeaponForm'

const STATUS_LABELS: Record<string, { label: string; badge: string }> = {
    Available: { label: 'Disponibile', badge: 'badge-green' },
    Sold: { label: 'Venduta', badge: 'badge-blue' },
    UnderRepair: { label: 'In Riparazione', badge: 'badge-yellow' },
    Destroyed: { label: 'Distrutta', badge: 'badge-red' },
    Donated: { label: 'Donata', badge: 'badge-gray' },
    Returned: { label: 'Restituita', badge: 'badge-gray' },
}

const CATEGORY_LABELS: Record<string, string> = {
    SmallArms: 'Armi Leggere',
    Artillery: 'Artiglieria',
    ArmoredVehicles: 'Mezzi Corazzati',
    Aircraft: 'Aeromobili',
    NavalSystems: 'Sistemi Navali',
    Missiles: 'Missili',
    Ammunition: 'Munizioni',
    Electronics: 'Elettronica',
    Other: 'Altro',
}

export default function WeaponsPage() {
    const [weapons, setWeapons] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [search, setSearch] = useState('')
    const [filterStatus, setFilterStatus] = useState('')
    const [filterCategory, setFilterCategory] = useState('')

    const fetchWeapons = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (filterStatus) params.set('status', filterStatus)
            if (filterCategory) params.set('category', filterCategory)
            const res = await fetch(`/api/weapons?${params}`)
            const data = await res.json()
            setWeapons(Array.isArray(data) ? data : [])
        } catch {
            setWeapons([])
        } finally {
            setLoading(false)
        }
    }, [filterStatus, filterCategory])

    useEffect(() => {
        fetchWeapons()
    }, [fetchWeapons])

    const filtered = weapons.filter(
        (w) =>
            w.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
            w.weaponType?.name?.toLowerCase().includes(search.toLowerCase()) ||
            w.weaponType?.brand?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Registro Armi</h1>
                    <p className="page-subtitle">{weapons.length} armi registrate nel sistema</p>
                </div>
                <button onClick={() => setShowForm(true)} className="btn-primary">
                    <Plus className="w-4 h-4" />
                    Registra Arma
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <input
                    className="input max-w-xs"
                    placeholder="Cerca per matricola, modello, marca..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    className="select w-44"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="">Tutti gli stati</option>
                    {Object.entries(STATUS_LABELS).map(([v, { label }]) => (
                        <option key={v} value={v}>{label}</option>
                    ))}
                </select>
                <select
                    className="select w-48"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                >
                    <option value="">Tutte le categorie</option>
                    {Object.entries(CATEGORY_LABELS).map(([v, label]) => (
                        <option key={v} value={v}>{label}</option>
                    ))}
                </select>
                {(filterStatus || filterCategory) && (
                    <button
                        onClick={() => { setFilterStatus(''); setFilterCategory('') }}
                        className="btn-ghost text-xs"
                    >
                        <Filter className="w-3.5 h-3.5" />
                        Reset filtri
                    </button>
                )}
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
                    <Crosshair className="w-12 h-12 text-steel-600 mx-auto mb-3" />
                    <p className="text-steel-400 font-medium">Nessuna arma trovata</p>
                    <p className="text-steel-600 text-sm mt-1">
                        {search || filterStatus || filterCategory
                            ? 'Prova a modificare i filtri di ricerca'
                            : 'Registra la prima arma nel sistema'}
                    </p>
                    {!search && !filterStatus && !filterCategory && (
                        <button onClick={() => setShowForm(true)} className="btn-primary mt-4 mx-auto">
                            <Plus className="w-4 h-4" />
                            Registra Arma
                        </button>
                    )}
                </div>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Matricola</th>
                                <th>Modello</th>
                                <th>Categoria</th>
                                <th>Marca</th>
                                <th>Stato</th>
                                <th>Proprietario</th>
                                <th>Acquisizione</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((weapon) => {
                                const statusCfg = STATUS_LABELS[weapon.status] || { label: weapon.status, badge: 'badge-gray' }
                                return (
                                    <tr key={weapon.id}>
                                        <td>
                                            <span className="font-mono text-xs text-military-300 bg-military-900/30 px-2 py-0.5 rounded">
                                                {weapon.serialNumber}
                                            </span>
                                        </td>
                                        <td className="font-medium text-steel-100">{weapon.weaponType?.name || '—'}</td>
                                        <td>
                                            <span className="badge-gray">
                                                {CATEGORY_LABELS[weapon.weaponType?.category] || weapon.weaponType?.category || '—'}
                                            </span>
                                        </td>
                                        <td className="text-steel-300">{weapon.weaponType?.brand || '—'}</td>
                                        <td>
                                            <span className={statusCfg.badge}>{statusCfg.label}</span>
                                        </td>
                                        <td className="text-steel-400 text-xs">
                                            {weapon.currentOwner
                                                ? `[${weapon.currentOwner.countryCode}] ${weapon.currentOwner.name}`
                                                : '—'}
                                        </td>
                                        <td className="text-steel-500 text-xs">
                                            {weapon.acquisitionDate
                                                ? new Intl.DateTimeFormat('it-IT').format(new Date(weapon.acquisitionDate))
                                                : '—'}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {showForm && (
                <WeaponForm
                    onClose={() => setShowForm(false)}
                    onSuccess={fetchWeapons}
                />
            )}
        </div>
    )
}
