import { Application, Router, send } from 'https://deno.land/x/oak@v9.0.1/mod.ts'

if (Deno.env.get('DENO_DEPLOYMENT_ID') === undefined) {
  await import('https://deno.land/x/dotenv@v3.0.0/load.ts')
}

import home from './views/home.js'
import podcast from './views/podcast.js'
import episode from './views/episode.js'
import feed from './views/feed.js'

const app = new Application()
const router = new Router()

app.addEventListener('error', (evt) => {
  console.log(evt.error)
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

app.use(router.routes())
app.use(router.allowedMethods())

await app.listen({ port: 8080 })