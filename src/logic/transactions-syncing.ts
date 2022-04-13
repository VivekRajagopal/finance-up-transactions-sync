import { SyncedRecord } from '../state/synced-records'
import { Transaction } from '../up-client'

export const findUnsyncedUpTransactions = (
  transactions: Transaction[],
  syncedRecords: SyncedRecord[],
): Transaction[] =>
  transactions.filter(
    (t) => !syncedRecords.find((r) => r.UpTransactionId === t.id),
  )
