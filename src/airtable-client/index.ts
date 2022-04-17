import { slicingWindows } from '../logic/array-util'

const FinanceBaseId = 'app5fCwwgEJIkn7Vp'
const UpTransactionsTableId = 'tblzRt84SM7VR3pYJ'
const ApiBaseUrl = `https://api.airtable.com/v0/${FinanceBaseId}/${UpTransactionsTableId}`

// Airtable "Create records" limitation
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

export type Record<T> = { id: string; createdTime: string; fields: T }
type RowsResponse<T> = {
  records: Record<T>[]
}

export async function getUpTransactionsAsync(): Promise<
  Record<UpTransactionRow>[]
> {
  const response = await fetch(`${ApiBaseUrl}?pageSize=100&sort[0][field]=SettledAt&sort[0][direction]=desc`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
  })

  const { records } = await response.json<RowsResponse<UpTransactionRow>>()

  return records
}

export async function createUpTransactionsAsync(
  rows: UpTransactionRow[],
): Promise<Record<UpTransactionRow>[]> {
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

    const { records } = await response.json<RowsResponse<UpTransactionRow>>()

    return records
  }

  const postRequests = slicingWindows(
    rows,
    MaxAllowedCreateRecordsPerRequest,
  ).map(postRequest)

  const results = await Promise.all(postRequests)
  return results.flat()
}
