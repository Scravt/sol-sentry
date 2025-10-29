import { TransactionsProps } from "@/types/transactionsType"
import Transaction from "@/components/ui/Transaction"

const WalletTransactions = ({ transactions }: TransactionsProps) => {
  return (
    <div className="flex flex-col gap-6 ">
      { transactions.map((tx) => (
        <Transaction key={tx.signature} transaction={tx} />        
      ))}
    </div>
  )
}

export default WalletTransactions