"use client";

import { useState, useEffect } from 'react';
import { databases, account } from '@/lib/appwrite-client'; // Importa el cliente de Appwrite
import { Models, AppwriteException } from 'appwrite'; // Importa el tipo 'Models'
import SubscriptionWallet from '@/components/SuscrioptionWallet';
import { useRouter } from 'next/navigation';

// IDs de la base de datos (leídos desde .env.local)
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID_WALLETS = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_WALLETS!;

// 1. Define un tipo para el documento de la wallet
// (Debe coincidir con la interfaz en SubscriptionWallet)
interface WalletDocument extends Models.Document {
  address: string;
  userId: string;
  name: string;
}

const DashboardPage = () => {
  const router = useRouter();
  
  // 2. Estados para manejar la lista de wallets y el usuario
  const [wallets, setWallets] = useState<WalletDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  
  // 3. NUEVO ESTADO PARA EL TOKEN JWT
  const [jwt, setJwt] = useState<string | null>(null);

  // 4. Este hook se ejecuta 1 vez cuando la página carga
  useEffect(() => {
    const checkUserAndFetchWallets = async () => {
      try {
        // Primero, verifica si hay un usuario logueado
        const loggedInUser = await account.get();
        setUser(loggedInUser);

        // 5. NUEVO: Obtenemos el JWT después de verificar al usuario
        const jwtResponse = await account.createJWT();
        setJwt(jwtResponse.jwt); // Guardamos el token en el estado

        // Si hay usuario, busca sus wallets
        // Esta llamada sigue funcionando con la cookie de sesión
        const response = await databases.listDocuments<WalletDocument>(
          DATABASE_ID,
          COLLECTION_ID_WALLETS
        );
        
        setWallets(response.documents);

      } catch (err) {
        // Si falla (ej. no hay cookie), redirige al login
        console.error("Error al cargar el dashboard:", err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkUserAndFetchWallets();
  }, [router]); // El array vacío significa "correr al montar"

  // 6. Función de Logout
  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      router.push('/login');
    } catch (err) {
      console.error(err);
    }
  };

  // 7. Renderiza la UI
  if (loading) {
    return <div className="text-center p-10">Cargando dashboard...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Bienvenido, {user?.name || user?.email || 'Usuario'}
        </h1>
        <button 
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 rounded-lg"
        >
          Logout
        </button>
      </header>

      {/* 8. ¡ACTUALIZADO! Pasa el JWT y el callback 'onWalletAdded' */}
      <SubscriptionWallet 
        jwt={jwt}
        onWalletAdded={(newWallet) => {
          // Esto actualiza la UI al instante sin recargar la página
          setWallets(currentWallets => [...currentWallets, newWallet]);
        }} 
      />

      <hr className="my-8 border-gray-700" />

      {/* 9. Aquí mostramos la lista de wallets */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Wallets Vigiladas</h2>
        {wallets.length === 0 ? (
          <p className="text-gray-400">No estás vigilando ninguna wallet todavía.</p>
        ) : (
          <ul className="space-y-3">
            {wallets.map((wallet) => (
              <li 
                key={wallet.$id} 
                className="bg-gray-800 p-4 rounded-lg shadow flex justify-between items-center"
              >
                <span className="font-mono text-lg">{wallet.name}</span>
                {/* Aquí puedes agregar un botón para ver transacciones o borrar */}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
