import layout from './layout.ts'
import { getPodcast, getEpisode, convertDateForWeb } from '../Helpers.ts'

export default async function(podcastSlug, episodeID) {

  const podcast = await getPodcast(podcastSlug)
  const episode = await getEpisode(episodeID)

  const head = /* html */`
    <link rel="stylesheet" href="https://cdn.plyr.io/3.6.4/plyr.css" />
    <!-- Scripts -->
    <script src="https://cdn.plyr.io/3.6.4/plyr.js"></script>
    <style>
        .plyr {
            min-width: 0;
        }
        .plyr--audio .plyr__controls {
            padding: 0;
        }
    </style>
  `

  const foot = `
    <script>
      const player = new Plyr('#player');
    </script>
  `

  const content = /*html*/`
  <div class="mt-3">
    <a href="/${ podcast.slug }">Back to podcast</a>
    <h1 class="mt-3">${ episode.title }</h1>
    <h5 class="text-secondary"><em>${ convertDateForWeb(episode.published) }</em></h5>
    <div class="mt-3">
      <audio id="player" controls>
        <source src="${ episode.audio.url }">
      </audio>
    </div>
    <div class="mt-3">${ episode.notes }</div>
  </div>
  `

  const final = layout({
    title: podcast.title + ' | ' + episode.title,
    head,
    foot,
    content
  })

  return final
}