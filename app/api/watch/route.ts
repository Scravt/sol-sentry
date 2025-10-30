import { NextResponse } from 'next/server';
// ¡YA NO SE USA 'cookies'!
import { getLoggedInUserFromJWT } from '@/lib/appwrite-server'; // Importa el nuevo helper JWT
// ¡CAMBIO CLAVE! Importa el SDK de ADMIN, no el de cliente
import { adminDatabases } from '@/lib/appwrite-admin';
// ¡CAMBIO CLAVE! Importa los tipos desde el SDK de NODE
import { Permission, Role, ID } from 'node-appwrite';

// --- Tus variables de entorno ---
const MY_PUBLIC_URL = process.env.URL_WEBHOOK!;
const HELIUS_API_KEY = process.env.HELIUS_API_KEY!;

// --- IDs de tu Base de Datos Appwrite ---
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID_WALLETS = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_WALLETS!;

// Forzamos el modo dinámico (buena práctica para API Routes)
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // --- 1. NUEVA LÓGICA DE AUTENTICACIÓN (JWT) ---
    const authHeader = request.headers.get('Authorization');

    // Verifica que el header exista y tenga el formato "Bearer <token>"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'No autorizado - Sin token' }, { status: 401 });
    }

    const jwt = authHeader.split(' ')[1]; // Extrae el token

    if (!jwt) {
      return NextResponse.json({ success: false, error: 'No autorizado - Token malformado' }, { status: 401 });
    }

    // Valida el JWT con Appwrite
    const user = await getLoggedInUserFromJWT(jwt);

    if (!user) {
      return NextResponse.json({ success: false, error: 'No autorizado - Token inválido' }, { status: 401 });
    }
    // --- FIN DE LA NUEVA LÓGICA ---

    const { walletAddress } = await request.json();

    // --- 2. Lógica de Helius (sin cambios) ---
    const response = await fetch(
      `https://api.helius.xyz/v0/webhooks?api-key=${HELIUS_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookURL: `${MY_PUBLIC_URL}/api/notify`,
          accountAddresses: [walletAddress],
          transactionTypes: ['ANY'],
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Error al crear el webhook en Helius');
    }

    // --- 3. Lógica de Base de Datos (con un 'userId' añadido) ---
    // ¡CAMBIO CLAVE! Usa 'adminDatabases' (el SDK de admin)
    const newWalletDoc = await adminDatabases.createDocument(
      DATABASE_ID,
      COLLECTION_ID_WALLETS,
      ID.unique(),
      {
        address: walletAddress,
        userId: user.$id // Guarda el ID del dueño (¡Añade este atributo en Appwrite!)
      },
      [
        // 'adminDatabases' SÍ tiene permiso para asignar esto
        Permission.read(Role.user(user.$id)),
        Permission.update(Role.user(user.$id)),
        Permission.delete(Role.user(user.$id)),
      ]
    );

    // 4. Devuelve el documento completo para el callback del frontend
    // (Esto es lo que recibe 'onWalletAdded' en el dashboard)
    return NextResponse.json({ success: true, document: newWalletDoc });

  } catch (error: Error | unknown) {
    console.error(error); // Imprime el error real en la consola del servidor

    let errorMessage = "Un error desconocido ocurrió.";
    if (error && typeof error === 'object' && 'response' in error) {
      errorMessage = (error as { response: { message: string } }).response.message || 'Error de Appwrite';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

