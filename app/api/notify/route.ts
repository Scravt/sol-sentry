// app/api/notify/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // ¡ESTA ES LA LÍNEA MÁGICA!
    // Imprime en tu terminal de 'npm run dev' el JSON exacto que mandó Helius.
    console.log("---------- HELIUS JSON CAPTURADO ----------");
    console.log(JSON.stringify(data, null, 2)); // El 'null, 2' lo hace bonito
    console.log("-------------------------------------------");

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error en el webhook /api/notify:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}