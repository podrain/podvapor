import { Router } from '../deps.ts'
import SessionInertia from '../session_inertia.ts'
import { isAuthenticated } from '../auth.ts'
import { sortByDateDescending, parseFormParams, convertDateForWeb } from '../helpers.ts'
import PodcastService from '../services/podcast_service.ts'
import EpisodeService from '../services/episode_service.ts'
import { getSignedUrl } from 'https://raw.githubusercontent.com/jcs224/aws_s3_presign/trunk/mod.ts'
import sql from '../db.ts'
import settings from '../settings.ts'
 
const adminRoutes = new Router()
.use(
  ...SessionInertia,
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
  const episode = await (new EpisodeService).getEpisode(ctx.params.id) as any
  const podcast = await (new PodcastService).getPodcast(episode.podcast_id)

  ctx.state.inertia.render('episode', {
    podcast,
    episode
  })
})
.get('/podcasts/:slug/newepisode', async (ctx) => {
  const podcast = await (new PodcastService).getPodcastBySlug(ctx.params.slug)

  ctx.state.inertia.render('episode-create', {
    podcast
  })
})
.post('/podcasts/create', async (ctx) => {
  const formParams = await parseFormParams(ctx)
  const podcast = await (new PodcastService).getPodcast(formParams.get('podcast_id')) as any

  const userInsert = {
    id: formParams.get('id'),
    title: formParams.get('title'),
    description: formParams.get('description'),
    notes: formParams.get('notes'),
    audio: formParams.get('audio'),
    duration: formParams.get('duration'),
    published: formParams.get('published'),
    podcast_id: formParams.get('podcast_id')
  }

  userInsert.audio.url = Deno.env.get('S3_PUBLIC_URL') + userInsert.audio.url

  await sql`insert into episodes ${ sql(userInsert) }`

  ctx.response.redirect('/admin/podcasts/'+podcast.slug)
})
.get('/podcasts/new', async (ctx) => {
  ctx.state.inertia.render('podcast-create')
})
.post('/podcasts', async (ctx) => {
  const formParams = await parseFormParams(ctx)

  const podcastInsert = {
    id: formParams.get('id'),
    title: formParams.get('title'),
    slug: formParams.get('slug'),
    description: formParams.get('description'),
    cover_image_url: Deno.env.get('S3_PUBLIC_URL') + formParams.get('cover_image_url'),
    categories: formParams.get('categories').map(cat => cat.name),
    owner: formParams.get('owner'),
    links: [],
    author: formParams.get('author'),
    copyright: formParams.get('copyright')
  }

  await sql`insert into podcasts ${ sql(podcastInsert) }`

  ctx.response.redirect('/admin/podcasts')
})
.get('/podcasts/:slug', async (ctx) => {
  const podcast = await (new PodcastService).getPodcastBySlug(ctx.params.slug) as any
  const episodes = (await (new PodcastService).getEpisodes(podcast.id)).sort(sortByDateDescending)

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
  const podcasts = await (new PodcastService).getPodcasts()

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
  await settings.set('site_name', formParams.get('siteName'))
  ctx.response.status = 303
  ctx.response.redirect('/admin/settings')
})
.get('/', async (ctx) => {
  ctx.response.redirect('/admin/podcasts')
})

const adminRouter = new Router().get('/admin', adminRoutes.routes(), adminRoutes.allowedMethods())

export default adminRouter