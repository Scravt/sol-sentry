import SuscrioptionWallet from "@/components/SuscrioptionWallet";
import WalletTransactions from "@/components/WalletTransactions";
import { transactionsMock  } from "@/mock/transactionsMock";


export default function Home() { 
  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col min-h-screen w-full max-w-3xl items-center bg-white dark:bg-black ">
        <SuscrioptionWallet />
        <WalletTransactions transactions={transactionsMock} />
      </main>
    </div>
  );
}
