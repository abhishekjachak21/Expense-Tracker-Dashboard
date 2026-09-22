import { useEffect, useState } from 'react'

function getInitialForm(selectedMonth) {
  const today = new Date().toISOString().slice(0, 10)
  const currentMonth = today.slice(0, 7)

  return {
    description: '',
    category: 'Food',
    amount: '',
    type: 'Expense',
    date: selectedMonth === currentMonth ? today : `${selectedMonth}-01`,
  }
}

function ExpenseForm({ onAddTransaction, selectedMonth }) {
  const [form, setForm] = useState(() => getInitialForm(selectedMonth))
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setForm(getInitialForm(selectedMonth))
    setError('')
  }, [selectedMonth])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const amount = Number(form.amount)

    if (!form.description.trim()) {
      setError('Please enter a description.')
      return
    }

    if (!form.amount || Number.isNaN(amount) || amount <= 0) {
      setError('Please enter an amount greater than zero.')
      return
    }

    try {
      setSaving(true)
      await onAddTransaction({
        ...form,
        description: form.description.trim(),
        amount,
      })
      setForm(getInitialForm(selectedMonth))
      setError('')
    } catch (err) {
      setError(err.message || 'Unable to save transaction.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="panel form-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Quick action</p>
          <h2>Add transaction</h2>
        </div>
        <span className="form-hint">All fields are required</span>
      </div>

      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-grid">
          <label>
            Description
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="e.g. Grocery shopping"
            />
          </label>

          <label>
            Amount
            <div className="amount-input">
              <span>₹</span>
              <input
                name="amount"
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
          </label>

          <label>
            Type
            <select name="type" value={form.type} onChange={handleChange}>
              <option>Expense</option>
              <option>Income</option>
            </select>
          </label>

          <label>
            Category
            <select name="category" value={form.category} onChange={handleChange}>
              <option>Food</option>
              <option>Transport</option>
              <option>Shopping</option>
              <option>Bills</option>
              <option>Entertainment</option>
              <option>Salary</option>
              <option>Other</option>
            </select>
          </label>

          <label>
            Date
            <input name="date" type="date" value={form.date} onChange={handleChange} />
          </label>
        </div>

        {error && <p className="form-error">{error}</p>}

        <button className="primary-button" type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Add transaction'}
        </button>
      </form>
    </section>
  )
}

export default ExpenseForm
