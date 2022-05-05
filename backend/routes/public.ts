import { Router } from '../deps.ts'

import home from '../views/home.js'
import podcast from '../views/podcast.js'
import episode from '../views/episode.js'
import feed from '../views/feed.js'

const publicRouter = new Router()
.get('/:slug/feed', async (ctx) => {
  ctx.response.headers.set('Content-Type', 'application/xml')
  ctx.response.body = await feed(ctx.params.slug)
})
.get('/:slug/episode/:episodeID', async (ctx) => {
  ctx.response.redirect(`/${ctx.params.slug}/${ctx.params.episodeID}`)
})
.get('/:slug/:episodeID', async (ctx) => {
  ctx.response.body = await episode(ctx.params.slug, ctx.params.episodeID)
})
.get('/:slug', async (ctx) => {
  ctx.response.body = await podcast(ctx.params.slug)
})
.get('/', async (ctx) => {
  ctx.response.body = await home()
})

export default publicRouter