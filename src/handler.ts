import {
  createUpTransactionsAsync,
  getUpTransactionsAsync,
  Record,
  UpTransactionRow,
} from './airtable-client'
import { fromUpTransaction } from './logic/mapping/airtable-record'
import { findUnsyncedUpTransactions } from './logic/transactions-syncing'
import { logRunAsync } from './state/run-log'
import { getSettledTransactionsAsync } from './up-client'

type HandlerResult =
  | { _tag: 'Sync'; newSyncedRows: Record<UpTransactionRow>[] }
  | { _tag: 'NoSync'; existingSyncedRecords: Record<UpTransactionRow>[] }

export async function syncUpTransactionsAsync(
  currentDateTimestamp: number,
): Promise<HandlerResult> {
  const startedAt = new Date(currentDateTimestamp)

  const transactionsResponse = await getSettledTransactionsAsync()

  const existingSyncedRecords = await getUpTransactionsAsync()

  const transactionsToSync = findUnsyncedUpTransactions(
    transactionsResponse.data,
    existingSyncedRecords,
  )

  const airtableRecordsToCreate = transactionsToSync.map(fromUpTransaction)

  if (airtableRecordsToCreate.length > 0) {
    const createdAirtableRecords = await createUpTransactionsAsync(
      airtableRecordsToCreate,
    )

    await logRunAsync(startedAt, {
      SyncedRecords: createdAirtableRecords,
    })

    return { _tag: 'Sync', newSyncedRows: createdAirtableRecords }
  } else {
    await logRunAsync(startedAt, 'NoSync')

    return { _tag: 'NoSync', existingSyncedRecords }
  }
}
