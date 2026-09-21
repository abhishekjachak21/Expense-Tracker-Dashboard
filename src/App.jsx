import { useEffect, useMemo, useState } from 'react'
import StatCard from './components/StatCard'
import TransactionTable from './components/TransactionTable'
import ExpenseForm from './components/ExpenseForm'
import { createTransaction, getTransactions } from './api'
import './App.css'

function formatDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function normalizeTransaction(transaction) {
  return {
    ...transaction,
    type: transaction.type === 'INCOME' ? 'Income' : 'Expense',
    date: formatDate(transaction.date),
  }
}

function App() {
  const [transactions, setTransactions] = useState([])
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadTransactions() {
      try {
        setLoading(true)
        const data = await getTransactions()
        setTransactions(data.map(normalizeTransaction))
        setError('')
      } catch (err) {
        setError(err.message || 'Unable to load transactions.')
      } finally {
        setLoading(false)
      }
    }

    loadTransactions()
  }, [])

  const totals = useMemo(() => {
    const income = transactions
      .filter((transaction) => transaction.type === 'Income')
      .reduce((sum, transaction) => sum + Number(transaction.amount), 0)

    const expenses = transactions
      .filter((transaction) => transaction.type === 'Expense')
      .reduce((sum, transaction) => sum + Number(transaction.amount), 0)

    return { income, expenses, balance: income - expenses }
  }, [transactions])

  const filteredTransactions = useMemo(() => {
    if (filter === 'All') return transactions
    return transactions.filter((transaction) => transaction.type === filter)
  }, [filter, transactions])

  async function handleAddTransaction(transaction) {
    try {
      setError('')
      const created = await createTransaction(transaction)
      setTransactions((current) => [normalizeTransaction(created), ...current])
    } catch (err) {
      setError(err.message || 'Unable to save transaction.')
      throw err
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="brand-kicker">Personal finance</p>
          <h1>Expense Tracker</h1>
        </div>
        <div className="user-chip">
          <span className="avatar">AJ</span>
          <div>
            <strong>Abhishek</strong>
            <span>Dashboard</span>
          </div>
        </div>
      </header>

      <main className="dashboard">
        <section className="welcome-row">
          <div>
            <p className="eyebrow">Overview</p>
            <h2>Good afternoon, Abhishek</h2>
            <p className="muted">Here is your current financial snapshot.</p>
          </div>
          <div className="period-badge">September 2026</div>
        </section>

        {error && <div className="api-error">{error}</div>}

        <section className="stats-container">
          <StatCard title="Total Balance" value={`₹${totals.balance.toLocaleString('en-IN')}`} />
          <StatCard title="Total Income" value={`₹${totals.income.toLocaleString('en-IN')}`} />
          <StatCard title="Total Expenses" value={`₹${totals.expenses.toLocaleString('en-IN')}`} />
        </section>

        <section className="content-grid">
          {loading ? (
            <section className="panel loading-panel">
              <p>Loading transactions...</p>
            </section>
          ) : (
            <TransactionTable transactions={filteredTransactions} />
          )}
          <ExpenseForm onAddTransaction={handleAddTransaction} />
        </section>

        <section className="filter-bar">
          <div>
            <p className="eyebrow">Filter</p>
            <strong>Transaction type</strong>
          </div>
          <div className="filter-buttons">
            {['All', 'Income', 'Expense'].map((type) => (
              <button
                key={type}
                className={`filter-button ${filter === type ? 'active' : ''}`}
                type="button"
                onClick={() => setFilter(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
