import { Client, Databases } from 'node-appwrite';

// Verifica que las variables de entorno existan
if (!process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT) {
  throw new Error("Missing env var: NEXT_PUBLIC_APPWRITE_ENDPOINT");
}
if (!process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID) {
  throw new Error("Missing env var: NEXT_PUBLIC_APPWRITE_PROJECT_ID");
}
if (!process.env.APPWRITE_API_KEY) {
  throw new Error("Missing env var: APPWRITE_API_KEY");
}

// Este cliente es un SUPER-ADMIN. Tiene acceso total.
// Se inicializa con la API Key secreta.
const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY); // <-- ¡LA MAGIA!

// Exporta una instancia de 'Databases' que tiene permisos de Admin
export const adminDatabases = new Databases(client);