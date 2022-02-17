import { Application, Router } from './deps.ts'
import 'https://deno.land/x/dotenv@v3.2.0/load.ts'
import mime from 'https://cdn.skypack.dev/mime-types'

import adminRouter from './routes/admin.ts'
import authRouter from './routes/auth.ts'
import publicRouter from './routes/public.ts'

const app = new Application()
const firstRouter = new Router()

if (Deno.env.get('DEBUG')) {
  app.addEventListener('error', (evt) => {
    console.log(evt.error)
  })
}

firstRouter
.get('/public/(.*)', async (ctx) => {
  const requestMimeType = mime.lookup(ctx.request.url.pathname)
  const responseMimeType = mime.contentType(requestMimeType)
  ctx.response.headers.set('Content-Type', responseMimeType)
  ctx.response.body = await Deno.readTextFile(Deno.cwd() + ctx.request.url.pathname)
})
.get('/robots.txt', (ctx) => {
  ctx.response.body = `User-agent: *
Disallow:`
})

app.use(async (ctx, next) => {
  await next()
  if (ctx.state.hasOwnProperty('inertia') && ctx.state.hasOwnProperty('session') && ctx.state.session.has('errors')) {
    ctx.state.inertia.setShared({
      errors: await ctx.state.session.get('errors')
    })
  }
})

app.use(firstRouter.routes(), firstRouter.allowedMethods())
app.use(authRouter.routes(), authRouter.allowedMethods())
app.use(adminRouter.routes(), adminRouter.allowedMethods())
app.use(publicRouter.routes(), publicRouter.allowedMethods())

app.listen({ port: 3001 })
console.log('server running')