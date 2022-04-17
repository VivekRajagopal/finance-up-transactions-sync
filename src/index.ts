import { syncUpTransactionsAsync } from './handler'

addEventListener('scheduled', (event) => {
  event.waitUntil(syncUpTransactionsAsync(Date.now()).then())
})

addEventListener('fetch', (event) => {
  event.respondWith(
    syncUpTransactionsAsync(Date.now()).then((result) => {
      return new Response(JSON.stringify(result), {
        status: 200,
      })
    }),
  )
})
