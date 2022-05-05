import layout from './layout.ts'
import { convertDateForWeb, sortByDateDescending } from '../helpers.ts'
import PodcastService from '../services/podcast_service.ts'

export default async function(slug) {
  const podcast = await (new PodcastService).getPodcastBySlug(slug)
  const episodes = await (new PodcastService).getEpisodes(podcast.id)

  const episodeList = episodes.sort(sortByDateDescending).map((ep, index) => {
    return /* html */`
      <div class="bg-gray-800 rounded p-4 ${ episodes.length > 1 && index !== episodes.length - 1 && 'mb-3' }">
        <h2 class="text-teal-100 text-xl"><a class="underline" href="/${ podcast.slug }/${ ep.id }">${ ep.title }</a></h2>
        <p class="mt-4"><em>${ convertDateForWeb(ep.published) }</em></p>
        <p class="mt-4">${ ep.description }</p>
        <div class="mt-4">
          <audio class="player" controls>
            <source src="${ ep.audio.url }">
          </audio>
        </div>
      </div>
    `
  }).join('<div class="mt-4"></div>')

  const head = /* html */`
    <link rel="alternate" href="${ Deno.env.get('DOMAIN') }/${ podcast.slug }/feed" type="application/rss+xml" title="${ podcast.title }">
    <link rel="stylesheet" href="https://cdn.plyr.io/3.6.4/plyr.css" />
    <!-- Scripts -->
    <script src="https://cdn.plyr.io/3.6.4/plyr.js"></script>
  `

  const foot = `
    <script>
      const player = Plyr.setup('.player');
    </script>
  `

  const final = await layout({
    title: podcast.title,
    head,
    foot,
    content: /* html */`
    <div class="p-4">
      <div class="flex flex-col sm:flex-row">
        <div class="sm:w-1/3 md:w-1/4">
          <img src="${ podcast.cover_image_url }" />
        </div>
        <div class="mt-4 sm:w-2/3 md:w-3/4 sm:mt-0 sm:ml-4">
          <a class="underline text-teal-200" href="/">Back to all podcasts</a>
          <h1 class="mt-4 text-3xl text-teal-100">${ podcast.title }</h1>
          <a class="inline-block mt-4 underline text-teal-200" href="/${ podcast.slug }/feed">RSS Feed</a>
          ${ podcast.links.map((lk, index) => `${ index == 0 ? '<br>' : '' }<a class="underline text-teal-200" href="${ lk.link }">${ lk.name }</a>`).join('<br>') }
          <p class="mt-4">${ podcast.description }</p>
        </div>
      </div>
      <h2 class="text-2xl my-4 text-teal-200">Episodes</h2>
      ${ episodeList }
    </div>
    `
  })

  return final
}