'use client'

import { useState, useEffect, useCallback } from 'react'
import { BookOpen, Search, Filter } from 'lucide-react'

const CATEGORY_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
    SmallArms: { label: 'Armi Leggere', color: 'text-military-300', icon: '🔫' },
    Artillery: { label: 'Artiglieria', color: 'text-warning-400', icon: '💣' },
    ArmoredVehicles: { label: 'Mezzi Corazzati', color: 'text-steel-300', icon: '🛡️' },
    Aircraft: { label: 'Aeromobili', color: 'text-accent-400', icon: '✈️' },
    NavalSystems: { label: 'Sistemi Navali', color: 'text-accent-400', icon: '⚓' },
    Missiles: { label: 'Missili', color: 'text-danger-400', icon: '🚀' },
    Ammunition: { label: 'Munizioni', color: 'text-warning-400', icon: '🎯' },
    Electronics: { label: 'Elettronica', color: 'text-accent-400', icon: '📡' },
    Other: { label: 'Altro', color: 'text-steel-400', icon: '📦' },
}

const CATEGORIES = Object.keys(CATEGORY_CONFIG)

export default function CatalogPage() {
    const [weaponTypes, setWeaponTypes] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filterCategory, setFilterCategory] = useState('')
    const [filterBrand, setFilterBrand] = useState('')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    const fetchTypes = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (filterCategory) params.set('category', filterCategory)
            if (filterBrand) params.set('brand', filterBrand)
            const res = await fetch(`/api/weapon-types?${params}`)
            const data = await res.json()
            setWeaponTypes(Array.isArray(data) ? data : [])
        } catch {
            setWeaponTypes([])
        } finally {
            setLoading(false)
        }
    }, [filterCategory, filterBrand])

    useEffect(() => {
        fetchTypes()
    }, [fetchTypes])

    const filtered = weaponTypes.filter(
        (wt) =>
            wt.name.toLowerCase().includes(search.toLowerCase()) ||
            wt.brand.toLowerCase().includes(search.toLowerCase()) ||
            (wt.description && wt.description.toLowerCase().includes(search.toLowerCase()))
    )

    // Get unique brands
    const brands = [...new Set(weaponTypes.map((wt) => wt.brand))].sort()

    // Group by category
    const grouped = CATEGORIES.reduce((acc, cat) => {
        const items = filtered.filter((wt) => wt.category === cat)
        if (items.length > 0) acc[cat] = items
        return acc
    }, {} as Record<string, any[]>)

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Catalogo Armi</h1>
                    <p className="page-subtitle">
                        {weaponTypes.length} tipologie di armi per categoria, tipo e marca
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}
                    >
                        Griglia
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}
                    >
                        Lista
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-steel-500" />
                    <input
                        className="input pl-9 w-64"
                        placeholder="Cerca modello, marca..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className="select w-48"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                >
                    <option value="">Tutte le categorie</option>
                    {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{CATEGORY_CONFIG[c].icon} {CATEGORY_CONFIG[c].label}</option>
                    ))}
                </select>
                <select
                    className="select w-44"
                    value={filterBrand}
                    onChange={(e) => setFilterBrand(e.target.value)}
                >
                    <option value="">Tutte le marche</option>
                    {brands.map((b) => (
                        <option key={b} value={b}>{b}</option>
                    ))}
                </select>
                {(filterCategory || filterBrand || search) && (
                    <button
                        onClick={() => { setFilterCategory(''); setFilterBrand(''); setSearch('') }}
                        className="btn-ghost text-xs"
                    >
                        <Filter className="w-3.5 h-3.5" />
                        Reset
                    </button>
                )}
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                    const count = weaponTypes.filter((wt) => wt.category === cat).length
                    if (count === 0) return null
                    const cfg = CATEGORY_CONFIG[cat]
                    return (
                        <button
                            key={cat}
                            onClick={() => setFilterCategory(filterCategory === cat ? '' : cat)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${filterCategory === cat
                                    ? 'bg-military-700/40 border-military-500 text-military-200'
                                    : 'bg-steel-800 border-steel-700 text-steel-400 hover:border-steel-500 hover:text-steel-200'
                                }`}
                        >
                            <span>{cfg.icon}</span>
                            <span>{cfg.label}</span>
                            <span className="bg-steel-700 px-1.5 rounded-full">{count}</span>
                        </button>
                    )
                })}
            </div>

            {/* Content */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="card animate-pulse">
                            <div className="h-4 bg-steel-700 rounded w-3/4 mb-3" />
                            <div className="h-3 bg-steel-700 rounded w-1/2 mb-4" />
                            <div className="h-3 bg-steel-700 rounded w-full" />
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="card text-center py-16">
                    <BookOpen className="w-12 h-12 text-steel-600 mx-auto mb-3" />
                    <p className="text-steel-400 font-medium">Nessuna tipologia trovata</p>
                    <p className="text-steel-600 text-sm mt-1">
                        Prova a modificare i filtri di ricerca
                    </p>
                </div>
            ) : viewMode === 'grid' ? (
                // Grouped Grid View
                <div className="space-y-8">
                    {Object.entries(grouped).map(([category, items]) => {
                        const cfg = CATEGORY_CONFIG[category]
                        return (
                            <div key={category}>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-2xl">{cfg.icon}</span>
                                    <h2 className="text-lg font-semibold text-steel-100">{cfg.label}</h2>
                                    <span className="badge-gray">{items.length}</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {items.map((wt) => (
                                        <div key={wt.id} className="card-hover group">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="font-semibold text-steel-100 text-sm">{wt.name}</h3>
                                                    <p className="text-xs text-military-400 font-medium mt-0.5">{wt.brand}</p>
                                                </div>
                                                <span className="badge-gray text-xs">{wt._count?.weapons ?? 0} unità</span>
                                            </div>
                                            {wt.description && (
                                                <p className="text-xs text-steel-500 line-clamp-2 mb-3">{wt.description}</p>
                                            )}
                                            <div className="flex items-center gap-2 pt-3 border-t border-steel-700">
                                                <span className={`text-xs font-medium ${cfg.color}`}>{cfg.icon} {cfg.label}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                // List View
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Modello</th>
                                <th>Categoria</th>
                                <th>Marca / Produttore</th>
                                <th>Descrizione</th>
                                <th>Unità Registrate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((wt) => {
                                const cfg = CATEGORY_CONFIG[wt.category] || { label: wt.category, color: 'text-steel-400', icon: '📦' }
                                return (
                                    <tr key={wt.id}>
                                        <td className="font-semibold text-steel-100">{wt.name}</td>
                                        <td>
                                            <span className="flex items-center gap-1.5 text-xs">
                                                <span>{cfg.icon}</span>
                                                <span className={cfg.color}>{cfg.label}</span>
                                            </span>
                                        </td>
                                        <td className="text-military-300 font-medium">{wt.brand}</td>
                                        <td className="text-steel-500 text-xs max-w-xs">
                                            <span className="line-clamp-2">{wt.description || '—'}</span>
                                        </td>
                                        <td>
                                            <span className="font-semibold text-steel-200">{wt._count?.weapons ?? 0}</span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
