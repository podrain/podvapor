import { Router } from '../deps.ts'
import inertia from '../inertia.ts'
import session from '../session.ts'
import { isAuthenticated } from '../auth.ts'
import { getPodcasts, getPodcast, getPodcastById, getEpisodes, sortByDateDescending, getEpisode, parseFormParams, convertDateForWeb } from '../helpers.ts'
import { getSignedUrl } from 'https://raw.githubusercontent.com/jcs224/aws_s3_presign/add-custom-endpoint/mod.ts'
import DB, { initDBMiddleware } from '../db.ts'
import settings from '../settings.ts'
 
const adminRoutes = new Router()
.use(
  initDBMiddleware(),
  inertia.initMiddleware(), 
  session.initMiddleware(), 
  isAuthenticated()
)
.get('/presigned-upload-url-images/:filename', async (ctx) => {
  const uploadURL = getSignedUrl({
    accessKeyId: Deno.env.get('S3_ACCESS_KEY')!,
    secretAccessKey: Deno.env.get('S3_SECRET_KEY')!,
    bucketName: Deno.env.get('S3_BUCKET')!,
    method: 'PUT',
    expiresIn: 900,
    objectPath: 'images/'+ctx.params.filename,
    endpoint: Deno.env.get('S3_ENDPOINT'),
  })

  ctx.response.body = uploadURL
})
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
.post('/podcasts/create', async (ctx) => {
  const formParams = await parseFormParams(ctx)
  const podcast = await getPodcastById(formParams.podcast_id) as any

  await DB.queryArray(`insert into episodes (id, title, description, notes, audio, duration, published, podcast_id) values ($1, $2, $3, $4, $5, $6, $7, $8)`, [
    formParams.id,
    formParams.title,
    formParams.description,
    formParams.notes,
    formParams.audio,
    formParams.duration,
    formParams.published,
    formParams.podcast_id
  ])

  ctx.response.redirect('/admin/podcasts/'+podcast.slug)
})
.get('/podcasts/new', async (ctx) => {
  ctx.state.inertia.render('podcast-create')
})
.post('/podcasts', async (ctx) => {
  const formParams = await parseFormParams(ctx)

  await DB.queryArray(`insert into podcasts (id, title, slug, description, cover_image_url, categories, owner, links, author, copyright) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`, [
    formParams.id,
    formParams.title,
    formParams.slug,
    formParams.description,
    formParams.cover_image_url,
    JSON.stringify(formParams.categories.map(cat => cat.name)),
    formParams.owner,
    JSON.stringify([]),
    formParams.author,
    formParams.copyright
  ])

  ctx.response.redirect('/admin/podcasts')
})
.get('/podcasts/:slug', async (ctx) => {
  const podcast = await getPodcast(ctx.params.slug) as any
  const episodes = (await getEpisodes(podcast.id)).sort(sortByDateDescending)

  const episodesModified = episodes.map((ep : any) => {
    ep.published = convertDateForWeb(ep.published)
    return ep
  })

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
  ctx.state.inertia.render('settings', {
    siteName: await settings.get('site_name')
  })
})
.put('/settings', async (ctx) => {
  const formParams = await parseFormParams(ctx)
  await settings.set('site_name', formParams.siteName)
  ctx.response.status = 303
  ctx.response.redirect('/admin/settings')
})
.get('/', async (ctx) => {
  ctx.response.redirect('/admin/podcasts')
})

const adminRouter = new Router().get('/admin', adminRoutes.routes(), adminRoutes.allowedMethods())

export default adminRouter