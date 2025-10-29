// en app/components/SubscriptionWallet.tsx (o donde vivan tus componentes)

"use client"; // 1. ¡MUY IMPORTANTE! Marca esto como un Componente de Cliente

import { useState } from 'react'
import CustomInput from './ui/CustomInput'
import CustomButton from './ui/CustomButton'

const SubscriptionWallet = () => {
  const [walletAddress, setWalletAddress] = useState('')

  // 2. Estados para manejar la UI mientras se hace la llamada
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWalletAddress(event.target.value)
    // Limpia los mensajes de error/éxito cuando el usuario vuelve a escribir
    setError(null)
    setSuccess(false)
  }

  // 3. Esta es la función que llama a tu API Route
  const handleSubmit = async () => {
    // No hacer nada si el input está vacío
    if (!walletAddress) {
      setError('Please enter a wallet address.');
      return;
    }

    setIsLoading(true); // Pone la UI en modo "cargando"
    setError(null);
    setSuccess(false);

    try {
      // 4. Llama a tu endpoint /api/watch
      const response = await fetch('/api/watch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress: walletAddress }), // Envía el JSON que tu API espera
      });

      const data = await response.json();

      if (!response.ok) {
        // Si la API devuelve un error (ej. status 500)
        // 'data.error' es el mensaje que pusiste en el 'catch' de tu API Route
        throw new Error(data.error || 'An unknown error occurred');
      }

      // 5. ¡Todo salió bien!
      setSuccess(true);
      setWalletAddress(''); // Limpia el input después del éxito

    } catch (err) {
      // Atrapa el error y lo muestra en la UI
      setError((err as Error).message);
    } finally {
      // 6. Pase lo que pase (éxito o error), deja de cargar
      setIsLoading(false);
    }
  }
  //

  return (
    <div className="flex flex-col items-center p-8">
        <h1 className="text-3xl font-bold mb-4">
            Enter the wallet address you want to track
        </h1>
        <div className='w-4/5 flex items-center gap-4'>
          <CustomInput 
            placeholder="Enter your wallet address" 
            value={walletAddress} 
            onChange={handleInputChange} 
            disabled={isLoading} // 7. Deshabilita el input mientras carga
          />
          <CustomButton 
            text={isLoading ? "Tracking..." : "Track"} // Cambia el texto del botón
            onClick={handleSubmit} 
            disabled={isLoading} // 7. Deshabilita el botón mientras carga
          />
        </div>

        {/* 8. Muestra los mensajes de estado al usuario */}
        {error && (
          <p className="text-red-500 mt-4">{error}</p>
        )}
        {success && (
          <p className="text-green-500 mt-4">Success! This wallet is now being tracked.</p>
        )}
    </div>
  )
}

export default SubscriptionWallet;