import { Transaction } from '../../src/up-client'

export function withTransactionId(
  transaction: Transaction,
  id: string,
): Transaction {
  return { ...transaction, id }
}
