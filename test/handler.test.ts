import { syncUpTransactionsAsync } from '../src/handler'

import * as UpClient from '../src/up-client'
import * as AirtableClient from '../src/airtable-client'
import * as Logger from '../src/state/run-log'

import { withTransactionId } from './helpers/transaction-helpers'

import transactionResource from '../res/samples/up-transaction.json'
import { fromUpTransaction } from '../src/logic/mapping/airtable-record'
import assert from 'assert'
import { Record, UpTransactionRow } from '../src/airtable-client'

const transaction = transactionResource as UpClient.Transaction

it('persists unsynced Up Transactions into Airtable', async () => {
  const upTransactions = [
    withTransactionId(transaction, 'synced-transaction-1'),
    withTransactionId(transaction, 'synced-transaction-2'),
    withTransactionId(transaction, 'new-transaction-1'),
    withTransactionId(transaction, 'new-transaction-2'),
  ]

  jest.spyOn(UpClient, 'getSettledTransactionsAsync').mockResolvedValue({
    data: upTransactions,
    links: { prev: null, next: null },
  })

  const syncedAirtableRecords = [upTransactions[0], upTransactions[1]].map(
    (tr) => ({
      id: 'rec123456',
      createdTime: '000',
      fields: fromUpTransaction(tr),
    }),
  )

  jest
    .spyOn(AirtableClient, 'getUpTransactionsAsync')
    .mockResolvedValue(syncedAirtableRecords)

  jest
    .spyOn(AirtableClient, 'createUpTransactionsAsync')
    .mockImplementation((rows) =>
      Promise.resolve(
        rows.map((row) => ({
          id: row.TransactionId,
          createdTime: '000',
          fields: row,
        })),
      ),
    )

  jest.spyOn(Logger, 'logRunAsync').mockResolvedValue()

  const handlerResult = await syncUpTransactionsAsync(0)

  assert(handlerResult._tag === 'Sync')

  const expectedNewSyncedTransactions: Record<UpTransactionRow>[] = [
    {
      createdTime: '000',
      fields: {
        AccountId: 'bd57bbc7-0159-415e-b650-7ac29218985c',
        AmountDollars: -59.98,
        Category: undefined,
        CreatedAt: '2022-03-21T03:10:21+11:00',
        Description: 'David Taylor',
        Message: 'Money for the pizzas last night.',
        RawText: undefined,
        SettledAt: '2022-03-21T03:10:21+11:00',
        Status: 'SETTLED',
        SubCategory: undefined,
        TransactionId: 'new-transaction-1',
      },
      id: 'new-transaction-1',
    },
    {
      createdTime: '000',
      fields: {
        AccountId: 'bd57bbc7-0159-415e-b650-7ac29218985c',
        AmountDollars: -59.98,
        Category: undefined,
        CreatedAt: '2022-03-21T03:10:21+11:00',
        Description: 'David Taylor',
        Message: 'Money for the pizzas last night.',
        RawText: undefined,
        SettledAt: '2022-03-21T03:10:21+11:00',
        Status: 'SETTLED',
        SubCategory: undefined,
        TransactionId: 'new-transaction-2',
      },
      id: 'new-transaction-2',
    },
  ]

  expect(handlerResult.newSyncedRows).toStrictEqual(
    expectedNewSyncedTransactions,
  )
})
