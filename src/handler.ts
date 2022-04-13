import { createUpTransactionsAsync } from './airtable-client'
import { fromUpTransaction } from './logic/mapping/airtable-record'
import { findUnsyncedUpTransactions } from './logic/transactions-syncing'
import { getLastRunAsync, updateLastRunAsync } from './state/last-run'
import {
  getSyncedRecordsAsync,
  SyncedRecord,
  updateSyncedRecordsAsync,
} from './state/synced-records'
import { GetSettledTransactionsAsync } from './up-client'

export async function syncUpTransactionsAsync(
  currentDateTimestamp: number,
): Promise<Response> {
  const lastRun = await getLastRunAsync()

  const startedAt = new Date(currentDateTimestamp)

  const transactionsResponse = await GetSettledTransactionsAsync()
  const existingSyncedRecords = await getSyncedRecordsAsync()

  const transactionsToSync = findUnsyncedUpTransactions(
    transactionsResponse.data,
    existingSyncedRecords,
  )

  const airtableRecordsToCreate = transactionsToSync.map(fromUpTransaction)

  if (airtableRecordsToCreate.length > 0) {
    const createdAirtableRecords = await createUpTransactionsAsync(
      airtableRecordsToCreate,
    )

    const newIterationId = (lastRun?.Iteration ?? 0) + 1
    const syncedRecords: SyncedRecord[] = createdAirtableRecords.map((r) => ({
      AirtableRecordId: r.id,
      UpTransactionId: r.fields.TransactionId,
      SyncRunId: newIterationId,
    }))

    await updateSyncedRecordsAsync(existingSyncedRecords, syncedRecords)

    await updateLastRunAsync({
      StartedAt: startedAt,
      Iteration: newIterationId,
      TransactionsSyncedCount: syncedRecords.length,
    })

    return new Response(
      JSON.stringify({
        existingSyncedRecords,
        transactionsToSync,
        syncedRecords,
      }),
      {
        status: 200,
      },
    )
  } else {
    return new Response(
      JSON.stringify({
        existingSyncedRecords,
        transactionsToSync,
      }),
      {
        status: 200,
      },
    )
  }
}
