import { TransactionType } from "@/types/transactionsType"

const Transaction = ({ transaction }: { transaction: TransactionType }) => {
  return (
    <div>
      <p>Type: {transaction.type}</p>
      <p>Date: {transaction.date}</p>
      <p>Amount: {transaction.amount}</p>
      <p>Status: {transaction.status}</p>
      <a href={transaction.link} target="_blank" rel="noopener noreferrer">View Transaction</a>
    </div>
  )
}

export default Transaction


