function TransactionTable({ transactions }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Activity</p>
          <h2>Recent transactions</h2>
        </div>
        <span className="count-badge">{transactions.length} records</span>
      </div>

      {transactions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">$</div>
          <h3>No transactions yet</h3>
          <p>Add your first income or expense to see it here.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Category</th>
                <th>Date</th>
                <th>Type</th>
                <th className="amount-column">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>
                    <div className="transaction-name">
                      <span className={`category-icon category-${transaction.type.toLowerCase()}`}>
                        {transaction.type === 'Income' ? '+' : '−'}
                      </span>
                      <div>
                        <strong>{transaction.description}</strong>
                        <span>{transaction.category}</span>
                      </div>
                    </div>
                  </td>
                  <td>{transaction.category}</td>
                  <td>{transaction.date}</td>
                  <td>
                    <span className={`status-pill status-${transaction.type.toLowerCase()}`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className={`amount ${transaction.type.toLowerCase()}`}>
                    {transaction.type === 'Income' ? '+' : '−'}₹{transaction.amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default TransactionTable
