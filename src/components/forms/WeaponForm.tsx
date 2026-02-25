'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface WeaponFormProps {
    onClose: () => void
    onSuccess: () => void
}

const CATEGORIES = [
    { value: 'SmallArms', label: 'Armi Leggere' },
    { value: 'Artillery', label: 'Artiglieria' },
    { value: 'ArmoredVehicles', label: 'Mezzi Corazzati' },
    { value: 'Aircraft', label: 'Aeromobili' },
    { value: 'NavalSystems', label: 'Sistemi Navali' },
    { value: 'Missiles', label: 'Missili' },
    { value: 'Ammunition', label: 'Munizioni' },
    { value: 'Electronics', label: 'Elettronica' },
    { value: 'Other', label: 'Altro' },
]

const STATUSES = [
    { value: 'Available', label: 'Disponibile' },
    { value: 'Sold', label: 'Venduta' },
    { value: 'UnderRepair', label: 'In Riparazione' },
    { value: 'Destroyed', label: 'Distrutta' },
    { value: 'Donated', label: 'Donata' },
]

export default function WeaponForm({ onClose, onSuccess }: WeaponFormProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [weaponTypes, setWeaponTypes] = useState<any[]>([])
    const [governments, setGovernments] = useState<any[]>([])
    const [showNewType, setShowNewType] = useState(false)

    const [form, setForm] = useState({
        serialNumber: '',
        weaponTypeId: '',
        status: 'Available',
        currentOwnerId: '',
        notes: '',
        acquisitionDate: '',
    })

    const [newType, setNewType] = useState({
        name: '',
        category: 'SmallArms',
        brand: '',
        description: '',
    })

    useEffect(() => {
        Promise.all([
            fetch('/api/weapon-types').then((r) => r.json()),
            fetch('/api/governments').then((r) => r.json()),
        ]).then(([types, govs]) => {
            setWeaponTypes(Array.isArray(types) ? types : [])
            setGovernments(Array.isArray(govs) ? govs : [])
        })
    }, [])

    const handleCreateType = async () => {
        if (!newType.name || !newType.brand) return
        const res = await fetch('/api/weapon-types', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newType),
        })
        if (res.ok) {
            const created = await res.json()
            setWeaponTypes((prev) => [...prev, created])
            setForm((f) => ({ ...f, weaponTypeId: created.id }))
            setShowNewType(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/weapons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    currentOwnerId: form.currentOwnerId || null,
                }),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Errore durante la creazione')
            }

            onSuccess()
            onClose()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <h2 className="text-lg font-semibold text-steel-50">Registra Arma</h2>
                        <p className="text-xs text-steel-400 mt-0.5">Aggiungi una nuova arma al registro</p>
                    </div>
                    <button onClick={onClose} className="btn-ghost p-1.5">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body space-y-4">
                        {error && (
                            <div className="p-3 bg-danger-600/10 border border-danger-600/30 rounded-lg text-danger-400 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="form-grid">
                            <div className="form-group">
                                <label className="label">Matricola / Numero di Serie *</label>
                                <input
                                    className="input font-mono"
                                    placeholder="es. M4A1-2024-001"
                                    value={form.serialNumber}
                                    onChange={(e) => setForm({ ...form, serialNumber: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="label">Stato</label>
                                <select
                                    className="select"
                                    value={form.status}
                                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                                >
                                    {STATUSES.map((s) => (
                                        <option key={s.value} value={s.value}>{s.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group md:col-span-2">
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="label mb-0">Tipo di Arma *</label>
                                    <button
                                        type="button"
                                        onClick={() => setShowNewType(!showNewType)}
                                        className="text-xs text-military-400 hover:text-military-300 transition-colors"
                                    >
                                        {showNewType ? '← Seleziona esistente' : '+ Nuovo tipo'}
                                    </button>
                                </div>

                                {showNewType ? (
                                    <div className="p-4 bg-steel-900/60 border border-steel-600 rounded-lg space-y-3">
                                        <div className="form-grid">
                                            <div className="form-group">
                                                <label className="label">Nome Modello</label>
                                                <input
                                                    className="input"
                                                    placeholder="es. M4A1 Carbine"
                                                    value={newType.name}
                                                    onChange={(e) => setNewType({ ...newType, name: e.target.value })}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="label">Marca / Produttore</label>
                                                <input
                                                    className="input"
                                                    placeholder="es. Colt Defense"
                                                    value={newType.brand}
                                                    onChange={(e) => setNewType({ ...newType, brand: e.target.value })}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="label">Categoria</label>
                                                <select
                                                    className="select"
                                                    value={newType.category}
                                                    onChange={(e) => setNewType({ ...newType, category: e.target.value })}
                                                >
                                                    {CATEGORIES.map((c) => (
                                                        <option key={c.value} value={c.value}>{c.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label className="label">Descrizione</label>
                                                <input
                                                    className="input"
                                                    placeholder="Breve descrizione"
                                                    value={newType.description}
                                                    onChange={(e) => setNewType({ ...newType, description: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <button type="button" onClick={handleCreateType} className="btn-secondary text-xs">
                                            Crea Tipo e Seleziona
                                        </button>
                                    </div>
                                ) : (
                                    <select
                                        className="select"
                                        value={form.weaponTypeId}
                                        onChange={(e) => setForm({ ...form, weaponTypeId: e.target.value })}
                                        required
                                    >
                                        <option value="">Seleziona tipo di arma...</option>
                                        {weaponTypes.map((wt) => (
                                            <option key={wt.id} value={wt.id}>
                                                {wt.brand} — {wt.name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="label">Proprietario Attuale</label>
                                <select
                                    className="select"
                                    value={form.currentOwnerId}
                                    onChange={(e) => setForm({ ...form, currentOwnerId: e.target.value })}
                                >
                                    <option value="">Nessun proprietario</option>
                                    {governments.map((g) => (
                                        <option key={g.id} value={g.id}>
                                            [{g.countryCode}] {g.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="label">Data Acquisizione</label>
                                <input
                                    className="input"
                                    type="date"
                                    value={form.acquisitionDate}
                                    onChange={(e) => setForm({ ...form, acquisitionDate: e.target.value })}
                                />
                            </div>

                            <div className="form-group md:col-span-2">
                                <label className="label">Note</label>
                                <textarea
                                    className="input resize-none"
                                    rows={2}
                                    placeholder="Note aggiuntive..."
                                    value={form.notes}
                                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="btn-secondary">
                            Annulla
                        </button>
                        <button type="submit" disabled={loading} className="btn-primary">
                            {loading ? 'Salvataggio...' : 'Registra Arma'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
