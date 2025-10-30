// app/api/notify/route.ts
import { NextResponse } from 'next/server';
import type { HeliusWebhookResponse } from '@/types/heliusWebhook';

export async function POST(request: Request) {
  try {
    // 1. Le dices a TypeScript que el JSON es un array de TransactionData
    const transactions: HeliusWebhookResponse = await request.json();

    console.log(`¡Notificación recibida! ${transactions.length} transacciones.`);

    // 2. Itera sobre cada transacción en el array
    for (const tx of transactions) {

      // 3. ¡TIENES AUTCOMPLETADO!
      // Ahora puedes acceder a los datos de forma segura
      console.log('Descripción:', tx.description);
      console.log('Tipo:', tx.type);
      console.log('Firma (ID):', tx.signature);
      console.log('Pagador de Fee:', tx.feePayer);
      console.log('Timestamp:', new Date(tx.timestamp * 1000).toLocaleString());

      // 4. Lógica para transferencias de SOL (nativo)
      if (tx.nativeTransfers && tx.nativeTransfers.length > 0) {
        for (const transfer of tx.nativeTransfers) {
          console.log(
            `Transferencia Nativa: ${transfer.fromUserAccount} envió ${transfer.amount / 1_000_000_000} SOL a ${transfer.toUserAccount}`
          );
          // Nota: El monto viene en "lamports", 1 SOL = 1,000,000,000 lamports
        }
      }

      // 5. Lógica para cambios de balance (útil para saber si recibiste)
      for (const account of tx.accountData) {
        if (account.nativeBalanceChange !== 0) {
          console.log(
            `Cambio de Balance: ${account.account} cambió en ${account.nativeBalanceChange / 1_000_000_000} SOL`
          );
        }
      }

      // TODO: Guardar en tu base de datos
      // await db.transaction.create({ ... });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error en el webhook /api/notify:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}