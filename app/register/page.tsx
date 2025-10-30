// app/register/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { account } from '@/lib/appwrite-client';
import { AppwriteException, ID } from 'appwrite'; // ¡Importante importar ID!

const RegisterPage = () => { // 1. Renombrado
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => { // 2. Renombrado
    e.preventDefault();
    setError(null);

    try {
      // 3. ¡AQUÍ ESTÁ EL CAMBIO!
      // Primero, creamos el usuario en la base de datos de Appwrite
      await account.create(
        ID.unique(), // Pide a Appwrite que genere un ID de usuario único
        email,
        password
      );

      // 4. (Opcional pero recomendado) 
      // Si la creación fue exitosa, logueamos al usuario automáticamente
      await account.createEmailPasswordSession(email, password);

      // 5. Si todo tiene éxito, redirige al dashboard
      router.push('/dashboard');

    } catch (err) {
      // ¡¡¡AÑADE ESTA LÍNEA!!!
      // Esto mostrará el error real en la consola de tu navegador
      console.error("ERROR COMPLETO:", err);

      if (err instanceof AppwriteException) {
        setError(err.message);
      } else {
        // Actualiza el mensaje para que te acuerdes de mirar la consola
        setError('Error inesperado. Revisa la consola del navegador.');
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleRegister} className="p-8 bg-gray-800 rounded-lg shadow-xl w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>

        {error && (
          <p className="bg-red-500 text-white p-3 rounded-md mb-4">{error}</p>
        )}

        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded-md bg-gray-700 text-white"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded-md bg-gray-700 text-white"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 py-2 rounded-md hover:bg-blue-600">
          Register
        </button>
        {/* Aquí puedes agregar un link a /login */}
      </form>
    </div>
  );
};

export default RegisterPage;