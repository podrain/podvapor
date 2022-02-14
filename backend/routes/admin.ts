import { Router } from '../deps.ts'
import inertia from '../inertia.ts'
import session from '../session.ts'
import { isAuthenticated } from '../auth.ts'
import { getPodcasts, getPodcast, getPodcastById, getEpisodes, sortByDateDescending, getEpisode } from '../helpers.ts'
import { getSignedUrl } from 'https://raw.githubusercontent.com/jcs224/aws_s3_presign/add-custom-endpoint/mod.ts'
 
const adminRoutes = new Router()
.use(
  inertia.initMiddleware(), 
  session.initMiddleware(), 
  isAuthenticated()
)
.get('/presigned-upload-url/:filename', async (ctx) => {
  const uploadURL = getSignedUrl({
    accessKeyId: Deno.env.get('S3_ACCESS_KEY')!,
    secretAccessKey: Deno.env.get('S3_SECRET_KEY')!,
    bucketName: Deno.env.get('S3_BUCKET')!,
    method: 'PUT',
    expiresIn: 900,
    objectPath: 'episode_audio_files/'+ctx.params.filename,
    endpoint: Deno.env.get('S3_ENDPOINT'),
  })

  ctx.response.body = uploadURL
})
.get('/episodes/:id', async (ctx) => {
  const episode = await getEpisode(ctx.params.id) as any
  const podcast = await getPodcastById(episode.podcast_id)

  ctx.state.inertia.render('episode', {
    podcast,
    episode
  })
})
.get('/podcasts/:slug/newepisode', async (ctx) => {
  const podcast = await getPodcast(ctx.params.slug)

  ctx.state.inertia.render('episode-create', {
    podcast
  })
})
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
.get('/settings', async (ctx) => {
  ctx.state.inertia.render('settings')
})
.get('/', async (ctx) => {
  ctx.response.redirect('/admin/podcasts')
})

const adminRouter = new Router().get('/admin', adminRoutes.routes(), adminRoutes.allowedMethods())

export default adminRouter