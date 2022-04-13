type LastRun = {
  Iteration: number
  StartedAt: Date
  TransactionsSyncedCount: number
}

const kvRunKey = 'last-run'

export async function getLastRunAsync(): Promise<LastRun | undefined> {
  const rawValue = await KV_FINANCE.get(kvRunKey)

  return rawValue ? (JSON.parse(rawValue) as LastRun) : undefined
}

export async function updateLastRunAsync({
  StartedAt,
  Iteration,
  TransactionsSyncedCount,
}: LastRun): Promise<void> {
  await KV_FINANCE.put(
    kvRunKey,
    JSON.stringify({
      StartedAt,
      Iteration,
      TransactionsSyncedCount,
    }),
  )
}
