import { useMemo, useState } from 'react'
import StatCard from './components/StatCard'
import TransactionTable from './components/TransactionTable'
import ExpenseForm from './components/ExpenseForm'
import './App.css'

const initialTransactions = [
  { id: 1, description: 'Monthly salary', category: 'Salary', amount: 60000, type: 'Income', date: '17 Sep 2026' },
  { id: 2, description: 'Weekend groceries', category: 'Food', amount: 2450, type: 'Expense', date: '16 Sep 2026' },
  { id: 3, description: 'Cab to office', category: 'Transport', amount: 680, type: 'Expense', date: '15 Sep 2026' },
  { id: 4, description: 'Movie night', category: 'Entertainment', amount: 1200, type: 'Expense', date: '13 Sep 2026' },
  { id: 5, description: 'Freelance work', category: 'Other', amount: 10500, type: 'Income', date: '11 Sep 2026' },
] 

function App() {
  const [transactions, setTransactions] = useState(initialTransactions)
  const [filter, setFilter] = useState('All')

  const totals = useMemo(() => {
    const income = transactions
      .filter((transaction) => transaction.type === 'Income')
      .reduce((sum, transaction) => sum + transaction.amount, 0)

    const expenses = transactions
      .filter((transaction) => transaction.type === 'Expense')
      .reduce((sum, transaction) => sum + transaction.amount, 0)

    return { income, expenses, balance: income - expenses }
  }, [transactions])

  const filteredTransactions = useMemo(() => {
    if (filter === 'All') return transactions
    return transactions.filter((transaction) => transaction.type === filter)
  }, [filter, transactions])

  function handleAddTransaction(transaction) {
    const newTransaction = {
      ...transaction,
      id: Date.now(),
      date: new Date(`${transaction.date}T00:00:00`).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    }

    setTransactions((current) => [newTransaction, ...current])
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

        <section className="stats-container">
          <StatCard title="Total Balance" value={`₹${totals.balance.toLocaleString('en-IN')}`} />
          <StatCard title="Total Income" value={`₹${totals.income.toLocaleString('en-IN')}`} />
          <StatCard title="Total Expenses" value={`₹${totals.expenses.toLocaleString('en-IN')}`} />
        </section>

        <section className="content-grid">
          <TransactionTable transactions={filteredTransactions} />
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
