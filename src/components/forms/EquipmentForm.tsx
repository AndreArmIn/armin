'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface EquipmentFormProps {
    onClose: () => void
    onSuccess: () => void
}

const CATEGORIES = [
    { value: 'ProtectiveGear', label: 'Equipaggiamento Protettivo' },
    { value: 'Optics', label: 'Ottica e Visori' },
    { value: 'Communications', label: 'Comunicazioni' },
    { value: 'Vehicles', label: 'Veicoli Leggeri' },
    { value: 'MedicalSupplies', label: 'Forniture Mediche' },
    { value: 'Clothing', label: 'Abbigliamento Militare' },
    { value: 'Tools', label: 'Attrezzatura e Strumenti' },
    { value: 'Other', label: 'Altro' },
]

export default function EquipmentForm({ onClose, onSuccess }: EquipmentFormProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({
        name: '',
        serialNumber: '',
        category: 'ProtectiveGear',
        brand: '',
        quantity: '1',
        description: '',
        status: 'Available',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/equipment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    quantity: parseInt(form.quantity) || 1,
                    serialNumber: form.serialNumber || null,
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
                        <h2 className="text-lg font-semibold text-steel-50">Registra Equipaggiamento</h2>
                        <p className="text-xs text-steel-400 mt-0.5">Aggiungi forniture militari non letali</p>
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
                            <div className="form-group md:col-span-2">
                                <label className="label">Nome / Denominazione *</label>
                                <input
                                    className="input"
                                    placeholder="es. Giubbotto Antiproiettile CRITICA III+"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="label">Categoria *</label>
                                <select
                                    className="select"
                                    value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                >
                                    {CATEGORIES.map((c) => (
                                        <option key={c.value} value={c.value}>{c.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="label">Marca / Produttore</label>
                                <input
                                    className="input"
                                    placeholder="es. Point Blank"
                                    value={form.brand}
                                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="label">Numero di Serie</label>
                                <input
                                    className="input font-mono"
                                    placeholder="es. VEST-2024-001"
                                    value={form.serialNumber}
                                    onChange={(e) => setForm({ ...form, serialNumber: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="label">Quantità</label>
                                <input
                                    className="input"
                                    type="number"
                                    min="1"
                                    value={form.quantity}
                                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="label">Stato</label>
                                <select
                                    className="select"
                                    value={form.status}
                                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                                >
                                    <option value="Available">Disponibile</option>
                                    <option value="Deployed">Dispiegato</option>
                                    <option value="UnderMaintenance">In Manutenzione</option>
                                    <option value="Retired">Ritirato</option>
                                </select>
                            </div>

                            <div className="form-group md:col-span-2">
                                <label className="label">Descrizione</label>
                                <textarea
                                    className="input resize-none"
                                    rows={3}
                                    placeholder="Descrizione dettagliata dell'equipaggiamento..."
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="btn-secondary">
                            Annulla
                        </button>
                        <button type="submit" disabled={loading} className="btn-primary">
                            {loading ? 'Salvataggio...' : 'Registra Equipaggiamento'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
