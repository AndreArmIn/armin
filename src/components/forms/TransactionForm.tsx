'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface TransactionFormProps {
    onClose: () => void
    onSuccess: () => void
}

const TX_TYPES = [
    { value: 'Sale', label: '💰 Vendita', desc: 'Contratto di vendita tra fornitore e governo' },
    { value: 'Delivery', label: '🚚 Consegna', desc: 'Spedizione e logistica verso il destinatario' },
    { value: 'Reception', label: '✅ Ricezione', desc: 'Conferma di avvenuta ricezione' },
    { value: 'Return', label: '↩️ Restituzione', desc: 'Reso di materiali (fine leasing o eccedenze)' },
    { value: 'Repair', label: '🔧 Riparazione', desc: 'Invio in assistenza tecnica' },
    { value: 'Replacement', label: '🔄 Sostituzione', desc: 'Rimpiazzo di unità difettose o obsolete' },
    { value: 'Destruction', label: '💥 Distruzione', desc: 'Certificazione di distruzione sicura' },
    { value: 'Donation', label: '🎁 Donazione', desc: 'Trasferimento a titolo gratuito' },
]

export default function TransactionForm({ onClose, onSuccess }: TransactionFormProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [weapons, setWeapons] = useState<any[]>([])
    const [equipment, setEquipment] = useState<any[]>([])
    const [governments, setGovernments] = useState<any[]>([])

    const [form, setForm] = useState({
        type: 'Sale',
        weaponId: '',
        equipmentId: '',
        fromId: '',
        toId: '',
        contractNumber: '',
        value: '',
        currency: 'USD',
        details: '',
        notes: '',
        timestamp: new Date().toISOString().slice(0, 16),
    })

    useEffect(() => {
        Promise.all([
            fetch('/api/weapons').then((r) => r.json()),
            fetch('/api/equipment').then((r) => r.json()),
            fetch('/api/governments').then((r) => r.json()),
        ]).then(([w, eq, g]) => {
            setWeapons(Array.isArray(w) ? w : [])
            setEquipment(Array.isArray(eq) ? eq : [])
            setGovernments(Array.isArray(g) ? g : [])
        })
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    weaponId: form.weaponId || null,
                    equipmentId: form.equipmentId || null,
                    fromId: form.fromId || null,
                    toId: form.toId || null,
                    value: form.value ? parseFloat(form.value) : null,
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

    const selectedType = TX_TYPES.find((t) => t.value === form.type)

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <h2 className="text-lg font-semibold text-steel-50">Registra Transazione</h2>
                        <p className="text-xs text-steel-400 mt-0.5">Registra una nuova operazione nel sistema</p>
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

                        {/* Transaction Type */}
                        <div className="form-group">
                            <label className="label">Tipo Operazione *</label>
                            <div className="grid grid-cols-2 gap-2">
                                {TX_TYPES.map((t) => (
                                    <button
                                        key={t.value}
                                        type="button"
                                        onClick={() => setForm({ ...form, type: t.value })}
                                        className={`text-left p-3 rounded-lg border text-sm transition-all duration-150 ${form.type === t.value
                                                ? 'border-military-500 bg-military-900/40 text-military-200'
                                                : 'border-steel-600 bg-steel-900/40 text-steel-400 hover:border-steel-500 hover:text-steel-300'
                                            }`}
                                    >
                                        <div className="font-medium">{t.label}</div>
                                        <div className="text-xs opacity-70 mt-0.5 line-clamp-1">{t.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="divider" />

                        <div className="form-grid">
                            {/* Asset */}
                            <div className="form-group">
                                <label className="label">Arma (opzionale)</label>
                                <select
                                    className="select"
                                    value={form.weaponId}
                                    onChange={(e) => setForm({ ...form, weaponId: e.target.value, equipmentId: '' })}
                                >
                                    <option value="">Nessuna arma</option>
                                    {weapons.map((w) => (
                                        <option key={w.id} value={w.id}>
                                            {w.serialNumber} — {w.weaponType?.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="label">Equipaggiamento (opzionale)</label>
                                <select
                                    className="select"
                                    value={form.equipmentId}
                                    onChange={(e) => setForm({ ...form, equipmentId: e.target.value, weaponId: '' })}
                                >
                                    <option value="">Nessun equipaggiamento</option>
                                    {equipment.map((eq) => (
                                        <option key={eq.id} value={eq.id}>
                                            {eq.name} (x{eq.quantity})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Parties */}
                            <div className="form-group">
                                <label className="label">Da (Governo/Fornitore)</label>
                                <select
                                    className="select"
                                    value={form.fromId}
                                    onChange={(e) => setForm({ ...form, fromId: e.target.value })}
                                >
                                    <option value="">Fornitore interno</option>
                                    {governments.map((g) => (
                                        <option key={g.id} value={g.id}>
                                            [{g.countryCode}] {g.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="label">A (Governo Destinatario)</label>
                                <select
                                    className="select"
                                    value={form.toId}
                                    onChange={(e) => setForm({ ...form, toId: e.target.value })}
                                >
                                    <option value="">Nessun destinatario</option>
                                    {governments.map((g) => (
                                        <option key={g.id} value={g.id}>
                                            [{g.countryCode}] {g.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Contract & Value */}
                            <div className="form-group">
                                <label className="label">Numero Contratto</label>
                                <input
                                    className="input font-mono"
                                    placeholder="es. CONTRACT-IT-2024-001"
                                    value={form.contractNumber}
                                    onChange={(e) => setForm({ ...form, contractNumber: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="label">Valore</label>
                                <div className="flex gap-2">
                                    <input
                                        className="input flex-1"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={form.value}
                                        onChange={(e) => setForm({ ...form, value: e.target.value })}
                                    />
                                    <select
                                        className="select w-24"
                                        value={form.currency}
                                        onChange={(e) => setForm({ ...form, currency: e.target.value })}
                                    >
                                        <option>USD</option>
                                        <option>EUR</option>
                                        <option>GBP</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="label">Data / Ora</label>
                                <input
                                    className="input"
                                    type="datetime-local"
                                    value={form.timestamp}
                                    onChange={(e) => setForm({ ...form, timestamp: e.target.value })}
                                />
                            </div>

                            <div className="form-group md:col-span-2">
                                <label className="label">Dettagli</label>
                                <textarea
                                    className="input resize-none"
                                    rows={2}
                                    placeholder="Descrizione dell'operazione..."
                                    value={form.details}
                                    onChange={(e) => setForm({ ...form, details: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="btn-secondary">
                            Annulla
                        </button>
                        <button type="submit" disabled={loading} className="btn-primary">
                            {loading ? 'Salvataggio...' : 'Registra Operazione'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
