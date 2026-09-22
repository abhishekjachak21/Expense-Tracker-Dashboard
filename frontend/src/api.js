const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://expense-tracker-backend-g11p.onrender.com/api/v1'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!response.ok) {
    let message = 'Something went wrong.'
    try {
      const body = await response.json()
      message = body.message || message
    } catch {
      // Keep the default message when the response is not JSON.
    }
    throw new Error(message)
  }

  if (response.status === 204) return null
  return response.json()
}

export function getTransactions(month) {
  return request(`/transactions?month=${month}`)
}

export function getSummary(month) {
  return request(`/transactions/summary?month=${month}`)
}

export function createTransaction(transaction) {
  return request('/transactions', {
    method: 'POST',
    body: JSON.stringify({
      ...transaction,
      type: transaction.type.toUpperCase(),
    }),
  })
}

export function deleteTransaction(id) {
  return request(`/transactions/${id}`, { method: 'DELETE' })
}
