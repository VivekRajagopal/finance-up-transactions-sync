import { components } from '../typings/up-api-v1'

export type TransactionsResponse =
  components['schemas']['ListTransactionsResponse']

export type Transaction = TransactionsResponse['data'][number]

const UpApiV1BaseUrl = 'https://api.up.com.au/api/v1/'

export async function GetSettledTransactionsAsync(): Promise<TransactionsResponse> {
  const response = await fetch(
    `${UpApiV1BaseUrl}/transactions?filter[status]=SETTLED&page[size]=100`,
    {
      headers: { Authorization: `Bearer ${UP_API_KEY}` },
    },
  )

  return response.json()
}
