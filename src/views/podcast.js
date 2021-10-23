import layout from './layout.ts'
import { getPodcasts } from '../Helpers.ts'

export default async function(slug) {
  const podcasts = await getPodcasts()

  const podcast = podcasts.filter(pc => pc.slug == slug)[0]

  const episodeList = podcast.episodes.map(ep => {
    return /* html */`
      <div class="card">
        <div class="card-body">
          <h4>${ ep.title }</h4>
          <p class="mt-3">${ ep.description }</p>
          <a href="/${ podcast.slug }/episode/${ ep.guid }">Read more</a>
          <div class="mt-3">
            <audio id="player" controls>
              <source src="${ ep.audio.url }">
            </audio>
          </div>
        </div>
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
    title: podcast.title,
    head,
    foot,
    content: /* html */`
    <div class="mt-3">
      <div class="d-flex">
        <div>
          <img style="width: 10rem;" src="${ podcast.cover_image_url }" />
        </div>
        <div class="ms-3">
          <a href="/">Back to all podcasts</a>
          <h1 class="mt-3">${ podcast.title }</h1>
          <a href="/${ podcast.slug }/feed">RSS Feed</a>
          <p class="mt-3">${ podcast.description }</p>
        </div>
      </div>
      <h2 class="mb-3">Episodes</h2>
      ${ episodeList }
    </div>
    `
  })

  return final
}