import { Router } from '../deps.ts'
import inertia from '../inertia.ts'
import session from '../session.ts'
import { isAuthenticated } from '../auth.ts'
import { getPodcasts, getPodcast, getEpisodes, sortByDateDescending } from '../helpers.ts'

const adminRoutes = new Router()
.use(
  inertia.initMiddleware(), 
  session.initMiddleware(), 
  isAuthenticated()
)
.get('/podcasts/:slug', async (ctx) => {
  const podcast = await getPodcast(ctx.params.slug) as any
  const episodes = (await getEpisodes(podcast.id)).sort(sortByDateDescending)

  ctx.state.inertia.render('podcast', {
    podcast,
    episodes
  })
})
.get('/podcasts', async (ctx) => {
  const podcasts = await getPodcasts()

  ctx.state.inertia.render('podcasts', {
    podcasts
  })
})
.get('/', async (ctx) => {
  ctx.response.redirect('/admin/podcasts')
})

const adminRouter = new Router().get('/admin', adminRoutes.routes(), adminRoutes.allowedMethods())

export default adminRouter