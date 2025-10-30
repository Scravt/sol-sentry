// lib/appwrite-server.ts
import { Client, Account } from 'appwrite';

// Esta función ahora RECIBE el string de la cookie
// en lugar de intentar leerla por sí misma.
export async function getLoggedInUser(sessionCookie: string) {
  try {
    // 1. Creamos un *nuevo* cliente SDK
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

    // 2. Ponemos la cookie que recibimos como parámetro
    client.setSession(sessionCookie);

    const account = new Account(client);
    const user = await account.get(); // Intenta obtener el usuario
    return user;

  } catch (error) {
    // Si la cookie no es válida, falla
    return null;
  }
}