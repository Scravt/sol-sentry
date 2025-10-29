import SuscrioptionWallet from "@/components/SuscrioptionWallet";


export default function Home() { 
  return (
    <div className="flex min-h-screen   bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col   bg-white dark:bg-black ">
        <SuscrioptionWallet />
      </main>
    </div>
  );
}
