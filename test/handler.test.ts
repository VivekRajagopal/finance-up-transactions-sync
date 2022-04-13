const upClient = require('../src/up-client')

jest.mock('../src/up-client')

it('syncs records', () => {
  upClient.GetSettledTransactionsAsync = () => Promise.resolve([])
})
