'use client'

import { useState, useEffect, useCallback } from 'react'
import { Globe, Plus, Mail, Phone, MapPin, Crosshair, ArrowLeftRight } from 'lucide-react'
import GovernmentForm from '@/components/forms/GovernmentForm'

export default function GovernmentsPage() {
    const [governments, setGovernments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [search, setSearch] = useState('')

    const fetchGovernments = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/governments')
            const data = await res.json()
            setGovernments(Array.isArray(data) ? data : [])
        } catch {
            setGovernments([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchGovernments()
    }, [fetchGovernments])

    const filtered = governments.filter(
        (g) =>
            g.name.toLowerCase().includes(search.toLowerCase()) ||
            g.countryCode.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Governi Partner</h1>
                    <p className="page-subtitle">{governments.length} governi registrati nel sistema</p>
                </div>
                <button onClick={() => setShowForm(true)} className="btn-primary">
                    <Plus className="w-4 h-4" />
                    Registra Governo
                </button>
            </div>

            {/* Search */}
            <div className="flex gap-3">
                <input
                    className="input max-w-sm"
                    placeholder="Cerca per nome o codice paese..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Grid */}
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
                    <Globe className="w-12 h-12 text-steel-600 mx-auto mb-3" />
                    <p className="text-steel-400 font-medium">Nessun governo trovato</p>
                    <p className="text-steel-600 text-sm mt-1">
                        {search ? 'Prova con un termine di ricerca diverso' : 'Registra il primo governo partner'}
                    </p>
                    {!search && (
                        <button onClick={() => setShowForm(true)} className="btn-primary mt-4 mx-auto">
                            <Plus className="w-4 h-4" />
                            Registra Governo
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((gov) => (
                        <div key={gov.id} className="card-hover group">
                            {/* Header */}
                            <div className="flex items-start gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-steel-700 flex items-center justify-center text-sm font-bold text-steel-200 shrink-0 font-mono">
                                    {gov.countryCode}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-steel-100 text-sm leading-tight">{gov.name}</h3>
                                    {gov.contactPerson && (
                                        <p className="text-xs text-steel-500 mt-0.5">{gov.contactPerson}</p>
                                    )}
                                </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-xs text-steel-400">
                                    <Mail className="w-3.5 h-3.5 shrink-0" />
                                    <span className="truncate">{gov.contactEmail}</span>
                                </div>
                                {gov.phone && (
                                    <div className="flex items-center gap-2 text-xs text-steel-400">
                                        <Phone className="w-3.5 h-3.5 shrink-0" />
                                        <span>{gov.phone}</span>
                                    </div>
                                )}
                                {gov.address && (
                                    <div className="flex items-center gap-2 text-xs text-steel-400">
                                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                                        <span className="truncate">{gov.address}</span>
                                    </div>
                                )}
                            </div>

                            {/* Stats */}
                            <div className="flex gap-3 pt-3 border-t border-steel-700">
                                <div className="flex items-center gap-1.5 text-xs text-steel-500">
                                    <Crosshair className="w-3.5 h-3.5" />
                                    <span>{gov._count?.weaponsOwned ?? 0} armi</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-steel-500">
                                    <ArrowLeftRight className="w-3.5 h-3.5" />
                                    <span>{gov._count?.transactionsTo ?? 0} transazioni</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showForm && (
                <GovernmentForm
                    onClose={() => setShowForm(false)}
                    onSuccess={fetchGovernments}
                />
            )}
        </div>
    )
}
