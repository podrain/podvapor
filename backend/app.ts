import { Application, Router } from './deps.ts'
import 'https://deno.land/std@0.159.0/dotenv/load.ts';

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
.get('/public/(.*)', async (ctx, next) => {
  try {
    await ctx.send({
      root: `${Deno.cwd()}`
    })
  } catch {
    await next()
  }
})
.get('/robots.txt', (ctx) => {
  ctx.response.body = `User-agent: *
Disallow:`
})
.get('/favicon.ico', async (ctx, next) => {
  try {
    await ctx.send({
      root: `${Deno.cwd()}/media`
    })
  } catch {
    await next()
  }
})

app.use(firstRouter.routes(), firstRouter.allowedMethods())
app.use(authRouter.routes(), authRouter.allowedMethods())
app.use(adminRouter.routes(), adminRouter.allowedMethods())
app.use(publicRouter.routes(), publicRouter.allowedMethods())

app.listen({ port: 3001, secure: true })
console.log('server running')