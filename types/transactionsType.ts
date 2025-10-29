export interface TransactionType {
    type: 'deposit' | 'NFT' | 'transfer'| 'swap';
    signature: string;
    date: string;
    amount: number;
    status: 'pending' | 'confirmed' | 'failed';
    link: string;
}

export interface TransactionsProps {
    transactions: TransactionType[];
}
