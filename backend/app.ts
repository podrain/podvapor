import { Application, Router } from './deps.ts'
import 'https://deno.land/x/dotenv@v3.2.0/load.ts'

import DB from './db.ts'
import adminRouter from './routes/admin.ts'
import { authRouter } from './auth.ts'
import publicRouter from './routes/public.ts'

const app = new Application()

if (Deno.env.get('DEBUG')) {
  app.addEventListener('error', (evt) => {
    console.log(evt.error)
  })
}

app.use(async (ctx, next) => {
  await DB.connect()
  await next()
  await DB.end()
})

app.use(authRouter.routes(), authRouter.allowedMethods())
app.use(adminRouter.routes(), adminRouter.allowedMethods())
app.use(publicRouter.routes(), publicRouter.allowedMethods())

app.listen({ port: 3001 })
console.log('server running')