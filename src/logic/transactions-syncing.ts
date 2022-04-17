import { Record, UpTransactionRow } from '../airtable-client'
import { Transaction } from '../up-client'

export const findUnsyncedUpTransactions = (
  transactions: Transaction[],
  syncedRecords: Record<UpTransactionRow>[],
): Transaction[] =>
  transactions.filter(
    (t) => !syncedRecords.find((r) => r.fields.TransactionId === t.id),
  )
