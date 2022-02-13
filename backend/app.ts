import { Application, Router } from './deps.ts'
import 'https://deno.land/x/dotenv@v3.2.0/load.ts'

import DB from './db.ts'
import adminRouter from './routes/admin.ts'
import { authRouter } from './auth.ts'

import home from './views/home.js'
import podcast from './views/podcast.js'
import episode from './views/episode.js'
import feed from './views/feed.js'

const app = new Application()
const router = new Router()

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

router
.get('/robots.txt', (ctx) => {
  ctx.response.body = `User-agent: *
Disallow:`
})
.get('/:slug/feed', async (ctx) => {
  ctx.response.headers.set('Content-Type', 'application/xml')
  ctx.response.body = await feed(ctx.params.slug)
})
.get('/:slug/episode/:episodeID', async (ctx) => {
  ctx.response.body = await episode(ctx.params.slug, ctx.params.episodeID)
})
.get('/:slug', async (ctx) => {
  ctx.response.body = await podcast(ctx.params.slug)
})
.get('/', async (ctx) => {
  ctx.response.body = await home()
})

app.use(authRouter.routes(), authRouter.allowedMethods())
app.use(adminRouter.routes(), adminRouter.allowedMethods())
app.use(router.routes(), router.allowedMethods())

app.listen({ port: 3001 })
console.log('server running')