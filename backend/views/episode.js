import layout from './layout.ts'
import { getPodcast, getEpisode, convertDateForWeb } from '../helpers.ts'

export default async function(podcastSlug, episodeID) {

  const podcast = await getPodcast(podcastSlug)
  const episode = await getEpisode(episodeID)

  const head = /* html */`
    <link rel="stylesheet" href="https://cdn.plyr.io/3.6.4/plyr.css" />
    <!-- Scripts -->
    <script src="https://cdn.plyr.io/3.6.4/plyr.js"></script>
  `

  const foot = `
    <script>
      const player = new Plyr('#player');
    </script>
  `

  const content = /*html*/`
  <div class="p-4">
    <a class="text-teal-200 underline" href="/${ podcast.slug }">Back to podcast</a>
    <h1 class="mt-4 text-3xl text-teal-100">${ episode.title }</h1>
    <h5 class="mt-4"><em>${ convertDateForWeb(episode.published) }</em></h5>
    <div class="mt-4">
      <audio id="player" controls>
        <source src="${ episode.audio.url }">
      </audio>
    </div>
    <div class="mt-4 prose">${ episode.notes }</div>
  </div>
  `

  const final = await layout({
    title: podcast.title + ' | ' + episode.title,
    head,
    foot,
    content
  })

  return final
}