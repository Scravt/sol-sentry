// app/api/watch/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; 
import { getLoggedInUser } from '@/lib/appwrite-server';
import { databases } from '@/lib/appwrite-client'; 
import { Permission, Role, ID } from 'appwrite'; 

// --- Tus variables de entorno ---
const MY_PUBLIC_URL = process.env.URL_WEBHOOK;
const HELIUS_API_KEY = process.env.HELIUS_API_KEY;

// --- IDs de tu Base de Datos Appwrite ---
const DATABASE_ID = 'ID_DE_TU_BASE_DE_DATOS_APPWRITE';
const COLLECTION_ID_WALLETS = 'wallets';

// 1. Mantenemos esto. Es 100% necesario.
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // --- ¡¡¡EL CAMBIO ESTÁ AQUÍ!!! ---
    // 2. Sigue la sugerencia del error y AÑADE 'await'
    const cookieStore = await cookies(); 
    
    // 3. Ahora esta línea debería ser válida
    const sessionCookie = cookieStore.get('a_session_' + process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'No autorizado - Sin sesión' }, { status: 401 });
    }

    const user = await getLoggedInUser(sessionCookie.value);
    
    if (!user) {
      return NextResponse.json({ success: false, error: 'No autorizado - Sesión inválida' }, { status: 401 });
    }
    // --- 

    const { walletAddress } = await request.json();

    // --- Lógica de Helius ---
    const response = await fetch(
      `https://api.helius.xyz/v0/webhooks?api-key=${HELIUS_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookURL: `${MY_PUBLIC_URL}/api/notify`, 
          accountAddresses: [walletAddress],
          transactionTypes: ['ANY'],
          network: 'devnet'
        }),
      }
    );
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Error al crear el webhook en Helius');
    }

    // --- Lógica de Base de Datos (Appwrite) ---
    const newWalletDoc = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID_WALLETS,
      ID.unique(),
      {
        address: walletAddress, 
      },
      [
        Permission.read(Role.user(user.$id)),
        Permission.update(Role.user(user.$id)),
        Permission.delete(Role.user(user.$id)),
      ]
    );

    return NextResponse.json({ success: true, webhookId: data.webhookID, docId: newWalletDoc.$id });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}