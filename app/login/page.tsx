"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { account } from '@/lib/appwrite-client';
import { AppwriteException } from 'appwrite';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // 1. Crea la sesión de email
      await account.createEmailPasswordSession(email, password);
      
      // 2. Si tiene éxito, redirige al dashboard (o a donde quieras)
      router.push('/dashboard'); // (Crearemos esta página después)

    } catch (err) {
      if (err instanceof AppwriteException) {
        setError(err.message);
      } else {
        setError('Ocurrió un error inesperado.');
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleLogin} className="p-8 bg-gray-800 rounded-lg shadow-xl w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        
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
          Login
        </button>
        {/* Aquí puedes agregar un link a /register */}
      </form>
    </div>
  );
};

export default LoginPage;