import { Transaction } from '../../../src/up-client/index'
import { UpTransactionRow } from '../../../src/airtable-client/index'

import { fromUpTransaction } from '../../../src/logic/mapping/airtable-record'

import transaction from '../../../res/samples/up-transaction.json'

describe('mapping-airtable-record', () => {
  test('maps from Up Transaction', () => {
    const expectedAirtableRecordRow: UpTransactionRow = {
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
      TransactionId: '45374614-d456-4868-9650-ab204be05f68',
    }

    expect(fromUpTransaction(transaction as Transaction)).toStrictEqual(
      expectedAirtableRecordRow,
    )
  })
})
