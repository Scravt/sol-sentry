// lib/appwrite-server.ts
import { Client, Account } from 'appwrite';

// Esta función valida un JWT y devuelve al usuario
export async function getLoggedInUserFromJWT(jwt: string) {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
      .setJWT(jwt); // ¡La magia! Le decimos al cliente que use este JWT

    const account = new Account(client);
    const user = await account.get(); // Intenta obtener el usuario
    return user;
  } catch (error) {
    // Si el JWT es inválido o expiró, falla
    console.error('Error obteniendo usuario desde JWT:', error);
    return null;
  }
}