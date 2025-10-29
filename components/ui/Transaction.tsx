import { TransactionType } from "@/types/transactionsType"

const Transaction = ({ transaction }: { transaction: TransactionType }) => {
  return (
    <div className="flex border p-16 gap-4 rounded-lg shadow-sm bg-white dark:bg-gray-800">
      <p> {transaction.type}</p>
      <p> {transaction.date}</p>
      <p> {transaction.amount}</p>
      <p> {transaction.status}</p>
      <a href={transaction.link} target="_blank" rel="noopener noreferrer">View Transaction</a>
    </div>
  )
}

export default Transaction


