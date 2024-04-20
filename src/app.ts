import { BARK_KEY } from './env.ts'
import { Handler } from './handler.ts'
import { Utils } from './util.ts'

Deno.serve((req: Request) => {
  const { pathname, searchParams } = new URL(req.url)

  const isAuthenticated = searchParams.get('key') === BARK_KEY

  // public routes
  switch (pathname) {
    case '/':
      return new Response(`Bark Server is running, deployed by Deno Deploy (${Date.now()})`)
    case '/healthz':
      return new Response('ok')
    case '/ping':
      return Utils.createRes('pong', 200)

    // mock to be compatible with the Bark iOS App
    case '/register':
      return Utils.createRes('success', 200, {
        key: 'you-should-edit-it-on-deno-deploy', // for old version
        device_key: 'you-should-edit-it-on-deno-deploy',
      })
    case '/register/you-should-edit-it-on-deno-deploy':
      return Utils.createRes('success', 200)
  }

  if (!isAuthenticated) {
    return Handler.noAuth()
  }

  // authenticated routes
  switch (pathname) {
    case '/info':
      return Handler.info()
    default:
      return Handler.pushNotification(req)
  }
})
