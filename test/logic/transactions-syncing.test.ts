import { Transaction } from '../../src/up-client/index'

import { findUnsyncedUpTransactions } from '../../src/logic/transactions-syncing'

import transactionResource from '../../res/samples/up-transaction.json'
import { Record, UpTransactionRow } from '../../src/airtable-client'

import { withTransactionId } from '../helpers/transaction-helpers'

describe('syncing', () => {
  const transaction = transactionResource as Transaction

  test('empty sync', () => {
    const syncedRecords: Record<UpTransactionRow>[] = []
    const newUpTransactions = [transaction, transaction].map((tr, i) =>
      withTransactionId(tr, i.toString()),
    )

    const expectedUnsyncedUpTransactions: Transaction[] = newUpTransactions

    expect(
      findUnsyncedUpTransactions(newUpTransactions, syncedRecords),
    ).toStrictEqual(expectedUnsyncedUpTransactions)
  })

  test('empty transactions', () => {
    const syncedRecords: Record<UpTransactionRow>[] = [
      {
        id: 'airtable-record-1',
        createdTime: '2022-01-01',
        fields: {
          AccountId: 'account-id',
          TransactionId: 'up-transaction-1',
          AmountDollars: 32.5,
          CreatedAt: 'created-at',
          Description: '',
          Status: 'SETTLED',
        },
      },
      {
        id: 'airtable-record-2',
        createdTime: '2022-01-01',
        fields: {
          AccountId: 'account-id',
          TransactionId: 'up-transaction-2',
          AmountDollars: 22.55,
          CreatedAt: 'created-at',
          Description: '',
          Status: 'SETTLED',
        },
      },
    ]

    const newUpTransactions: Transaction[] = []

    const expectedUnsyncedUpTransactions: Transaction[] = []

    expect(
      findUnsyncedUpTransactions(newUpTransactions, syncedRecords),
    ).toStrictEqual(expectedUnsyncedUpTransactions)
  })

  test('fully synced', () => {
    const syncedRecords: Record<UpTransactionRow>[] = [
      {
        id: 'airtable-record-1',
        createdTime: '2022-01-01',
        fields: {
          AccountId: 'account-id',
          TransactionId: 'up-transaction-1',
          AmountDollars: 32.5,
          CreatedAt: 'created-at',
          Description: '',
          Status: 'SETTLED',
        },
      },
      {
        id: 'airtable-record-2',
        createdTime: '2022-01-01',
        fields: {
          AccountId: 'account-id',
          TransactionId: 'up-transaction-2',
          AmountDollars: 22.55,
          CreatedAt: 'created-at',
          Description: '',
          Status: 'SETTLED',
        },
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
    const syncedRecords: Record<UpTransactionRow>[] = [
      {
        id: 'airtable-record-1',
        createdTime: '2022-01-01',
        fields: {
          AccountId: 'account-id',
          TransactionId: 'up-transaction-1',
          AmountDollars: 32.5,
          CreatedAt: 'created-at',
          Description: '',
          Status: 'SETTLED',
        },
      },
      {
        id: 'airtable-record-2',
        createdTime: '2022-01-01',
        fields: {
          AccountId: 'account-id',
          TransactionId: 'up-transaction-2',
          AmountDollars: 22.55,
          CreatedAt: 'created-at',
          Description: '',
          Status: 'SETTLED',
        },
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
