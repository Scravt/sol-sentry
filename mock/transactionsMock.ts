import { TransactionType } from '../types/transactionsType'

const transactionsMock: TransactionType[] = [
  {
    type: 'deposit',
    signature: '0x123',
    date: '2023-01-01',
    amount: 100,
    status: 'confirmed',
    link: 'https://example.com/tx/0x123'
  },
  {
    type: 'NFT',
    signature: '0x456',
    date: '2023-01-02',
    amount: 200,
    status: 'pending',
    link: 'https://example.com/tx/0x456'
  },
  {
    type: 'transfer',
    signature: '0x789',
    date: '2023-01-03',
    amount: 300,
    status: 'failed',
    link: 'https://example.com/tx/0x789'
  },
  {
    type: 'swap',
    signature: '0xabc',
    date: '2023-01-04',
    amount: 400,
    status: 'confirmed',
    link: 'https://example.com/tx/0xabc'
  }
]

export { transactionsMock }
