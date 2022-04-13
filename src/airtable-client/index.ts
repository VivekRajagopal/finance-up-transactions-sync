import { slicingWindows } from '../logic/array-util'

const FinanceBaseId = 'app5fCwwgEJIkn7Vp'
const UpTransactionsTableId = 'tblzRt84SM7VR3pYJ'
const ApiBaseUrl = `https://api.airtable.com/v0/${FinanceBaseId}/${UpTransactionsTableId}`

const MaxAllowedCreateRecordsPerRequest = 10

export type UpTransactionRow = {
  TransactionId: string
  AccountId: string
  Status: 'HELD' | 'SETTLED'
  RawText?: string
  Description: string
  Message?: string
  AmountDollars: number
  SettledAt?: string
  CreatedAt: string
  Category?: string
  SubCategory?: string
}

type CreateAirtableRowsRequest<T> = {
  records: { fields: T }[]
}

export type AirtableRecord<T> = { id: string; createdTime: string; fields: T }
type CreateAirtableRowsResponse<T> = {
  records: AirtableRecord<T>[]
}

export async function createUpTransactionsAsync(
  rows: UpTransactionRow[],
): Promise<AirtableRecord<UpTransactionRow>[]> {
  const postRequest = async (rows: UpTransactionRow[]) => {
    const requestBody: CreateAirtableRowsRequest<UpTransactionRow> = {
      records: rows.map((fields) => ({ fields })),
    }

    const response = await fetch(ApiBaseUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    const { records } = await response.json<
      CreateAirtableRowsResponse<UpTransactionRow>
    >()

    return records
  }

  const postRequests = slicingWindows(
    rows,
    MaxAllowedCreateRecordsPerRequest,
  ).map(postRequest)

  const results = await Promise.all(postRequests)
  return results.flat()
}
