import CustomInput from './ui/CustomInput'
import CustomButton from './ui/CustomButton'

const SuscrioptionWallet = () => {
  return (
    <div className="flex flex-col items-center p-8">
        <h1 className="text-3xl font-bold mb-4">
            Enter the wallet address you want to track
        </h1>
        <div className='w-4/5 flex items-center gap-4'>
          <CustomInput placeholder="Enter your wallet address" />
          <CustomButton text="Track" />
        </div>
    </div>


  )
}

export default SuscrioptionWallet