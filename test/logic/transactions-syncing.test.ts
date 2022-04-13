import { Transaction } from '../../src/up-client/index'

import { findUnsyncedUpTransactions } from '../../src/logic/transactions-syncing'

import transactionResource from '../../res/samples/up-transaction.json'
import { SyncedRecord } from '../../src/state/synced-records'

function withTransactionId(transaction: Transaction, id: string) {
  return { ...transaction, id }
}

describe('syncing', () => {
  const transaction = transactionResource as Transaction

  test('empty sync', () => {
    const syncedRecords: SyncedRecord[] = []
    const newUpTransactions = [transaction, transaction].map((tr, i) =>
      withTransactionId(tr, i.toString()),
    )

    const expectedUnsyncedUpTransactions: Transaction[] = newUpTransactions

    expect(
      findUnsyncedUpTransactions(newUpTransactions, syncedRecords),
    ).toStrictEqual(expectedUnsyncedUpTransactions)
  })

  test('empty transactions', () => {
    const syncedRecords: SyncedRecord[] = [
      {
        AirtableRecordId: 'airtable-record-1',
        UpTransactionId: 'up-transaction-1',
        SyncRunId: 22,
      },
      {
        AirtableRecordId: 'airtable-record-2',
        UpTransactionId: 'up-transaction-2',
        SyncRunId: 23,
      },
    ]

    const newUpTransactions: Transaction[] = []

    const expectedUnsyncedUpTransactions: Transaction[] = []

    expect(
      findUnsyncedUpTransactions(newUpTransactions, syncedRecords),
    ).toStrictEqual(expectedUnsyncedUpTransactions)
  })

  test('fully synced', () => {
    const syncedRecords: SyncedRecord[] = [
      {
        AirtableRecordId: 'airtable-record-1',
        UpTransactionId: 'up-transaction-1',
        SyncRunId: 22,
      },
      {
        AirtableRecordId: 'airtable-record-2',
        UpTransactionId: 'up-transaction-2',
        SyncRunId: 23,
      },
    ]

    const newUpTransactions = [transaction, transaction].map(
      (tr, i): Transaction => withTransactionId(tr, `up-transaction-${i + 1}`),
    )

    const expectedUnsyncedUpTransactions: Transaction[] = []

    expect(
      findUnsyncedUpTransactions(newUpTransactions, syncedRecords),
    ).toStrictEqual(expectedUnsyncedUpTransactions)
  })

  test('partially synced', () => {
    const syncedRecords: SyncedRecord[] = [
      {
        AirtableRecordId: 'airtable-record-1',
        UpTransactionId: 'up-transaction-1',
        SyncRunId: 22,
      },
      {
        AirtableRecordId: 'airtable-record-2',
        UpTransactionId: 'up-transaction-2',
        SyncRunId: 23,
      },
    ]

    const newUpTransactions = [
      transaction,
      transaction,
      transaction,
      transaction,
    ].map(
      (tr, i): Transaction => withTransactionId(tr, `up-transaction-${i + 1}`),
    )

    const expectedUnsyncedUpTransactions = [
      withTransactionId(transaction, 'up-transaction-3'),
      withTransactionId(transaction, 'up-transaction-4'),
    ]

    expect(
      findUnsyncedUpTransactions(newUpTransactions, syncedRecords),
    ).toStrictEqual(expectedUnsyncedUpTransactions)
  })
})
