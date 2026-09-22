import { useEffect, useState } from 'react'
import StatCard from './components/StatCard'
import TransactionTable from './components/TransactionTable'
import ExpenseForm from './components/ExpenseForm'
import { createTransaction, getSummary, getTransactions } from './api'
import './App.css'

const MONTHS = Array.from({ length: 12 }, (_, index) => {
  const month = String(index + 1).padStart(2, '0')
  return {
    value: `2026-${month}`,
    label: new Date(2026, index, 1).toLocaleDateString('en-IN', {
      month: 'long',
      year: 'numeric',
    }),
  }
})

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
  const [selectedMonth, setSelectedMonth] = useState('2026-09')
  const [transactions, setTransactions] = useState([])
  const [summary, setSummary] = useState({
    income: 0,
    expenses: 0,
    balance: 0,
  })
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadMonthData() {
      try {
        setLoading(true)
        setError('')

        const [transactionData, summaryData] = await Promise.all([
          getTransactions(selectedMonth),
          getSummary(selectedMonth),
        ])

        setTransactions(transactionData.map(normalizeTransaction))
        setSummary(summaryData)
      } catch (err) {
        setError(err.message || 'Unable to load transactions.')
        setTransactions([])
        setSummary({ income: 0, expenses: 0, balance: 0 })
      } finally {
        setLoading(false)
      }
    }

    loadMonthData()
  }, [selectedMonth])

  const filteredTransactions =
    filter === 'All'
      ? transactions
      : transactions.filter((transaction) => transaction.type === filter)

  async function handleAddTransaction(transaction) {
    try {
      setError('')
      const created = await createTransaction(transaction)

      const createdMonth = transaction.date.slice(0, 7)

      if (createdMonth === selectedMonth) {
        setTransactions((current) => [normalizeTransaction(created), ...current])

        const nextSummary = {
          income:
            transaction.type === 'Income'
              ? summary.income + Number(transaction.amount)
              : summary.income,
          expenses:
            transaction.type === 'Expense'
              ? summary.expenses + Number(transaction.amount)
              : summary.expenses,
        }

        setSummary({
          ...nextSummary,
          balance: nextSummary.income - nextSummary.expenses,
        })
      }
    } catch (err) {
      setError(err.message || 'Unable to save transaction.')
      throw err
    }
  }

  const selectedMonthLabel =
    MONTHS.find((month) => month.value === selectedMonth)?.label || selectedMonth

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

          <select
            className="period-select"
            value={selectedMonth}
            onChange={(event) => {
              setSelectedMonth(event.target.value)
              setFilter('All')
            }}
            aria-label="Select transaction month"
          >
            {MONTHS.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </section>

        {error && <div className="api-error">{error}</div>}

        <section className="stats-container">
          <StatCard title="Total Income" value={`₹${Number(summary.income).toLocaleString('en-IN')}`} />
          <StatCard title="Total Expenses" value={`₹${Number(summary.expenses).toLocaleString('en-IN')}`} />
          <StatCard title="Total Balance" value={`₹${Number(summary.balance).toLocaleString('en-IN')}`} />
        </section>

        <section className="content-grid">
          {loading ? (
            <section className="panel loading-panel">
              <p>Loading {selectedMonthLabel} transactions...</p>
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
