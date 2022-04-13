import { syncUpTransactionsAsync } from './handler'

addEventListener('scheduled', (event) => {
  event.waitUntil(
    syncUpTransactionsAsync(Date.now())
      .then(() => {
        KV_FINANCE.put('last-result', 'ok')
      })
      .catch((err) => KV_FINANCE.put('last-result', JSON.stringify({ err }))),
  )
})

addEventListener('fetch', (event) => {
  event.respondWith(syncUpTransactionsAsync(Date.now()))
})
