import layout from './layout.ts'
import { getPodcasts } from '../Helpers.ts'

export default async function(slug) {
  const podcasts = await getPodcasts()

  const podcast = podcasts.filter(pc => pc.slug == slug)[0]

  const episodeList = podcast.episodes.map(ep => {
    return /* html */`
      <div>
        <a href="/${ podcast.slug }/${ ep.guid }">
        ${ ep.title }
        </a>
        <audio id="player" controls>
          <source src="${ ep.audio.url }">
        </audio>
      </div>
    `
  })

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

  const final = layout({
    head,
    foot,
    content: /* html */`
    <div class="mt-3">
      <a href="/">Back to all podcasts</a>
      <h1>${ podcast.title }</h1>
      <p>${ podcast.description }</p>
      ${ episodeList }
    </div>
    `
  })

  return final
}