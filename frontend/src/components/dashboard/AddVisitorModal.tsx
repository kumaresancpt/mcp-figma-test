import React, { useState } from 'react'
import { CreateVisitorPayload } from '../../services/dashboardService'

interface AddVisitorModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (payload: CreateVisitorPayload) => Promise<void>
}

const purposes = ['Meeting', 'Official', 'Interview', 'Delivery', 'Maintenance', 'Event']

const AddVisitorModal: React.FC<AddVisitorModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState<CreateVisitorPayload>({ name: '', purpose: 'Meeting' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Name is required'); return }
    setLoading(true)
    setError('')
    try {
      await onSubmit(form)
      setForm({ name: '', purpose: 'Meeting' })
      onClose()
    } catch {
      setError('Failed to add visitor. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-inter font-semibold text-lg text-gray-800">Add Visitor</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-inter font-medium text-gray-700 mb-1">Name *</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-inter outline-none focus:ring-2 focus:ring-primary/30" placeholder="Visitor name" />
          </div>
          <div>
            <label className="block text-sm font-inter font-medium text-gray-700 mb-1">Company</label>
            <input name="company" value={form.company || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-inter outline-none focus:ring-2 focus:ring-primary/30" placeholder="Company name" />
          </div>
          <div>
            <label className="block text-sm font-inter font-medium text-gray-700 mb-1">Purpose *</label>
            <select name="purpose" value={form.purpose} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-inter outline-none focus:ring-2 focus:ring-primary/30">
              {purposes.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-inter font-medium text-gray-700 mb-1">Scheduled Time</label>
            <input name="scheduled_time" type="datetime-local" value={form.scheduled_time || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-inter outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-700 rounded-lg py-2 text-sm font-inter hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-primary text-white rounded-lg py-2 text-sm font-inter font-semibold hover:opacity-90 transition-opacity disabled:opacity-60">
              {loading ? 'Adding...' : 'Add Visitor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddVisitorModal
