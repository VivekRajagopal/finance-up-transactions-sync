export const SyncedRecordsKey = 'synced-records'

/**
 * See ten-synced-records.state.json.
 * 10 Records is about ~1.2 kB. Cloudflare allows Values up to 25 MB. Total records is ~200,000.
 * 1000 records is plenty for average use, and easily fits into Cloudflare KV.
 * After limit is reached, oldest records are clipped first.
 */
const MaxSyncedRecords = 1000

export type SyncedRecord = {
  UpTransactionId: string
  AirtableRecordId: string
  SyncRunId: number
}

export const getSyncedRecordsAsync = async (): Promise<SyncedRecord[]> => {
  const rawValue = await KV_FINANCE.get(SyncedRecordsKey)
  return rawValue ? (JSON.parse(rawValue) as SyncedRecord[]) : []
}

export const updateSyncedRecordsAsync = (
  existingRecords: SyncedRecord[],
  newRecords: SyncedRecord[],
): Promise<void> => {
  const allRecords = [...existingRecords, ...newRecords].slice(
    -MaxSyncedRecords,
  )

  return KV_FINANCE.put(SyncedRecordsKey, JSON.stringify(allRecords))
}
