// app/api/watch/route.ts
import { NextResponse } from 'next/server';
const MY_PUBLIC_URL = process.env.URL_WEBHOOK
const HELIUS_API_KEY = process.env.HELIUS_API_KEY;

export async function POST(request: Request) {
  try {
    const { walletAddress } = await request.json();

    const response = await fetch(
      `https://api.helius.xyz/v0/webhooks?api-key=${HELIUS_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          //  URL a la que Helius te va a notificar.
          webhookURL: `${MY_PUBLIC_URL}/api/notify`,
          
          // que wallets vigilar
          accountAddresses: [walletAddress],
          
          // tipo de transacciones 
          transactionTypes: ['ANY'],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al crear el webhook');
    }
    return NextResponse.json({ success: true, webhookId: data.webhookID });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}