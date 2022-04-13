import { UpTransactionRow } from '../../airtable-client'
import { Transaction } from '../../up-client'

export const fromUpTransaction = (
  transaction: Transaction,
): UpTransactionRow => ({
  TransactionId: transaction.id,
  AccountId: transaction.relationships.account.data.id,
  Status: transaction.attributes.status,
  RawText: transaction.attributes.rawText ?? undefined,
  Description: transaction.attributes.description,
  Message: transaction.attributes.message ?? undefined,
  AmountDollars: parseFloat(transaction.attributes.amount.value),
  SettledAt: transaction.attributes.settledAt ?? undefined,
  CreatedAt: transaction.attributes.createdAt,
  Category: transaction.relationships.parentCategory.data?.id,
  SubCategory: transaction.relationships.category.data?.id,
})
