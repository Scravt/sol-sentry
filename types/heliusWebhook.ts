// en lib/types/heliusWebhook.ts

// Helius envía un ARRAY de TransactionData
export type HeliusWebhookResponse = TransactionData[];

export interface TransactionData {
    accountData: AccountDatum[];
    description: string;
    events: unknown;
    fee: number;
    feePayer: string;
    instructions: Instruction[];
    nativeTransfers: NativeTransfer[];
    signature: string;
    slot: number;
    source: string;
    timestamp: number;
    tokenTransfers: unknown[]; // Déjalo como 'any' por ahora, está bien
    transactionError: null | unknown; // Permitir error de cualquier forma usando 'unknown'
    type: string;
}

export interface AccountDatum {
    account: string;
    nativeBalanceChange: number;
    tokenBalanceChanges:  unknown[];
}


export interface Instruction {
    accounts: string[];
    data: string; // Esto es data 'base58' encriptada, no la usarás
    innerInstructions: unknown[];
    programId: string;
}

export interface NativeTransfer {
    amount: number;
    fromUserAccount: string;
    toUserAccount: string;
}