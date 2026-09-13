import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import StatCard from './components/StatCard'

import './App.css'

function App() {
  return (
    <div>
      <h1>Expense Tracker</h1>
      <p>Manage your income and expenses</p>

            <div className="stats-container">
        <StatCard title="Balance" value="₹42,500" />
        <StatCard title="Income" value="₹60,000" />
        <StatCard title="Expenses" value="₹17,500" />
      </div>

    </div>
  )
}

export default App
