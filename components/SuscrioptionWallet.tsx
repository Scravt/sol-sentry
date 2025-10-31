"use client";

import { useState } from 'react';
import { Models } from 'appwrite';
import CustomInput from './ui/CustomInput';
import CustomButton from './ui/CustomButton';

// 1. Define un tipo para el documento Wallet que esperamos recibir de vuelta
// (Esto es para el callback 'onWalletAdded')
interface WalletDocument extends Models.Document {
  address: string;
  userId: string;
  name: string;
}

// 2. Define los PROPS que este componente AHORA ACEPTA
interface SubscriptionWalletProps {
  jwt: string | null; // El token de sesión del dashboard
  onWalletAdded: (newWallet: WalletDocument) => void; // El callback para actualizar la lista
}

const SubscriptionWallet = ({ jwt, onWalletAdded }: SubscriptionWalletProps) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [walletName, setWalletName] = useState(''); // Correcto
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWalletAddress(event.target.value);
    setError(null);
  }
  const handleInputChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWalletName(event.target.value);
    setError(null);
  }


  const handleSubmit = async () => {
    if (!walletAddress) {
      setError('Please enter a wallet address.');
      return;
    }
    if (!walletName) {
      setError('Please enter a wallet name.');
      return;
    }

    // 3. Nueva Verificación: Asegúrate de que el JWT haya cargado
    if (!jwt) {
      setError('Session is not ready. Please wait a moment and try again.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Llama a tu endpoint
      const response = await fetch('/api/watch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          //  Envía el JWT como un "Bearer Token"
          'Authorization': `Bearer ${jwt}`
        },
        // ¡¡¡CAMBIO 1: AÑADE walletName AL PAYLOAD!!!
        body: JSON.stringify({
          walletAddress: walletAddress,
          walletName: walletName // <--- LA LÍNEA QUE FALTABA
        }),

      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'An unknown error occurred');
      }


      setWalletAddress(''); // Limpia el input
      // ¡¡¡CAMBIO 2: Limpia el input del nombre!!!
      setWalletName(''); // <--- AÑADIDO PARA MEJOR UX
      onWalletAdded(data.document); // Llama al callback para actualizar la UI del Dashboard

    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    // Tu JSX para el formulario está perfecto, no necesita cambios
    <div className="flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-4">
        Enter the wallet address you want to track
      </h1>
      <div className='w-4/5 flex items-center gap-4'>
        <CustomInput
          placeholder="Name your wallet"
          value={walletName}
          onChange={handleInputChangeName}
          disabled={isLoading || !jwt}
        />
        <CustomInput
          placeholder="Enter your wallet address"
          value={walletAddress}
          onChange={handleInputChange}
          disabled={isLoading || !jwt}
           />
        <CustomButton
          text={isLoading ? "Tracking..." : "Track"}
          onClick={handleSubmit}
          disabled={isLoading || !jwt}
        />
      </div>

      {error && (
        <p className="text-red-500 mt-4">{error}</p>
      )}
    </div>
  )
}

export default SubscriptionWallet;