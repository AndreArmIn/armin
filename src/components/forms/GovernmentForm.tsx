'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface GovernmentFormProps {
    onClose: () => void
    onSuccess: () => void
}

export default function GovernmentForm({ onClose, onSuccess }: GovernmentFormProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({
        name: '',
        countryCode: '',
        contactEmail: '',
        contactPerson: '',
        phone: '',
        address: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/governments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
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
                        <h2 className="text-lg font-semibold text-steel-50">Registra Governo</h2>
                        <p className="text-xs text-steel-400 mt-0.5">Aggiungi un nuovo governo partner</p>
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
                                <label className="label">Nome Governo / Ministero *</label>
                                <input
                                    className="input"
                                    placeholder="es. Ministero della Difesa Italiano"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="label">Codice Paese (ISO) *</label>
                                <input
                                    className="input"
                                    placeholder="es. IT, US, DE"
                                    maxLength={3}
                                    value={form.countryCode}
                                    onChange={(e) => setForm({ ...form, countryCode: e.target.value.toUpperCase() })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="label">Email Contatto *</label>
                                <input
                                    className="input"
                                    type="email"
                                    placeholder="es. procurement@difesa.it"
                                    value={form.contactEmail}
                                    onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="label">Referente</label>
                                <input
                                    className="input"
                                    placeholder="es. Gen. Mario Rossi"
                                    value={form.contactPerson}
                                    onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="label">Telefono</label>
                                <input
                                    className="input"
                                    type="tel"
                                    placeholder="es. +39-06-555-0100"
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                />
                            </div>

                            <div className="form-group md:col-span-2">
                                <label className="label">Indirizzo</label>
                                <input
                                    className="input"
                                    placeholder="es. Via XX Settembre 8, 00187 Roma"
                                    value={form.address}
                                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="btn-secondary">
                            Annulla
                        </button>
                        <button type="submit" disabled={loading} className="btn-primary">
                            {loading ? 'Salvataggio...' : 'Registra Governo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
