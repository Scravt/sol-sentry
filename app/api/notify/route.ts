import { NextResponse } from 'next/server';
import type { HeliusWebhookResponse } from '@/types/heliusWebhook';
import { adminDatabases } from '@/lib/appwrite-admin';
import { Permission, Role, ID, Query } from 'node-appwrite'; // ¡Necesitas Query!

// --- IDs de tu Base de Datos Appwrite ---
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID_WALLETS = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_WALLETS!;
const COLLECTION_ID_TRANSACTIONS = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_TRANSACTIONS!;


export async function POST(request: Request) {
  try {
    const transactions: HeliusWebhookResponse = await request.json();
    console.log(`¡Notificación recibida! ${transactions.length} transacciones.`);

    for (const tx of transactions) {

      // --- INICIO DE LA LÓGICA FALTANTE ---

      // 1. Encontrar a qué Wallet (y usuario) pertenece esta transacción
      let parentWalletDoc: any = null;
      let ownerId: string | null = null;

      // Helius nos da *todas* las cuentas de la tx. Debemos buscar en nuestra BD
      // cuál de ellas es una que estamos vigilando.
      for (const account of tx.accountData) {
        const walletQuery = await adminDatabases.listDocuments(
          DATABASE_ID,
          COLLECTION_ID_WALLETS, // Busca en tu colección 'wallets'
          [
            Query.equal('address', account.account), // Busca una wallet con esta dirección
            Query.limit(1) // Solo necesitamos una
          ]
        );

        if (walletQuery.documents.length > 0) {
          parentWalletDoc = walletQuery.documents[0];
          ownerId = parentWalletDoc.userId; // ¡Asumiendo que guardaste 'userId' en la 'Wallet'!
          break; // ¡Encontramos la wallet! Dejamos de buscar.
        }
      }

      // 2. Si no encontramos una wallet (o no tiene dueño), no podemos guardar la tx.
      if (!parentWalletDoc || !ownerId) {
        console.warn(`Transacción ${tx.signature} recibida, pero no pertenece a ninguna wallet vigilada. Ignorando.`);
        continue; // Salta a la siguiente transacción en el bucle
      }

      // --- FIN DE LA LÓGICA FALTANTE ---

      // 3. Preparar el documento de la transacción
      const newTransactionData = {
        description: tx.description,
        type: tx.type,
        signature: tx.signature,
        source: tx.source,
        fee: tx.fee,
        feePayer: tx.feePayer,
        timestamp: tx.timestamp,

        // ¡¡¡AQUÍ ESTÁ LA CORRECCIÓN!!!
        // Coincide con el nombre de tu atributo 'wallets'
        wallets: parentWalletDoc.$id,

        // ¡IMPORTANTE! Guarda los arrays como strings JSON
        // Tu atributo de Appwrite debe ser 'String'
        nativeTransfers_json: JSON.stringify(tx.nativeTransfers),
        accountData_json: JSON.stringify(tx.accountData),
      };

      // 4. Crear el documento CON permisos
      const newTransactionDoc = await adminDatabases.createDocument(
        DATABASE_ID,
        COLLECTION_ID_TRANSACTIONS,
        ID.unique(),
        newTransactionData,
        [
          // ¡LOS PERMISOS!
          // Solo el dueño de la wallet puede leer esta transacción
          Permission.read(Role.user(ownerId)),
          Permission.delete(Role.user(ownerId))
        ]
      );

      console.log(`Transacción ${newTransactionDoc.signature} guardada y vinculada a la wallet ${parentWalletDoc.name}`);
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Error en el webhook /api/notify:', error);
    // Imprime el error de Appwrite si existe
    if (error.response) {
      console.error('Error de Appwrite:', error.response.message);
    }
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}