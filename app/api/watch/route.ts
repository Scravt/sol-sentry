import { NextResponse } from 'next/server';
import { getLoggedInUserFromJWT } from '@/lib/appwrite-server'; 
import { adminDatabases } from '@/lib/appwrite-admin';
import { Permission, Role, ID } from 'node-appwrite';


const MY_PUBLIC_URL = process.env.URL_WEBHOOK!;
const HELIUS_API_KEY = process.env.HELIUS_API_KEY!;
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID_WALLETS = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_WALLETS!;


export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'No autorizado - Sin token' }, { status: 401 });
    }
    const jwt = authHeader.split(' ')[1]; 

    if (!jwt) {
      return NextResponse.json({ success: false, error: 'No autorizado - Token malformado' }, { status: 401 });
    }

    const user = await getLoggedInUserFromJWT(jwt);

    if (!user) {
      return NextResponse.json({ success: false, error: 'No autorizado - Token inválido' }, { status: 401 });
    }

    const { walletAddress, walletName } = await request.json();

   
    if (!walletAddress || !walletName) {
      return NextResponse.json({ success: false, error: 'Wallet address and name are required' }, { status: 400 });
    }

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

    const newWalletDoc = await adminDatabases.createDocument(
      DATABASE_ID,
      COLLECTION_ID_WALLETS,
      ID.unique(),
      {
        address: walletAddress,
        userId: user.$id, 
        name: walletName  
      },
      [
        Permission.read(Role.user(user.$id)),
        Permission.update(Role.user(user.$id)),
        Permission.delete(Role.user(user.$id)),
      ]
    );

    return NextResponse.json({ success: true, document: newWalletDoc });

  } catch (error: any) { 
    console.error(error); 

    let errorMessage = "Un error desconocido ocurrió.";
  
    if (error && error.response && error.response.message) {
      errorMessage = error.response.message;
      } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}