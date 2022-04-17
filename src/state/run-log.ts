import { Record, UpTransactionRow } from '../airtable-client'

type VoidLog = 'NoSync'

type SyncLog = {
  SyncedRecords: Record<UpTransactionRow>[]
}

type LogEntry = VoidLog | SyncLog

const LogTimeToLiveSecondsFromCreation = 604800 // 7 days

export async function logRunAsync(runTime: Date, log: LogEntry): Promise<void> {
  await KV_FINANCE.put(
    `run-log-${runTime.toISOString()}`,
    JSON.stringify(log),
    {
      expirationTtl: LogTimeToLiveSecondsFromCreation,
    },
  )
}
