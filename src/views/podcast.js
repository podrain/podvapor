import layout from './layout.ts'
import { getPodcasts, getPodcast, getEpisodes, convertDateForWeb, sortByDateDescending } from '../Helpers.ts'

export default async function(slug) {
  const podcast = await getPodcast(slug)
  const episodes = await getEpisodes(podcast.id)

  const episodeList = episodes.sort(sortByDateDescending).map(ep => {
    return /* html */`
      <div class="card">
        <div class="card-body">
          <h4>${ ep.title }</h4>
          <p class="text-secondary"><em>${ convertDateForWeb(ep.published) }</em></p>
          <p class="mt-3">${ ep.description }</p>
          <a href="/${ podcast.slug }/episode/${ ep.id }">Read more</a>
          <div class="mt-3">
            <audio class="player" controls>
              <source src="${ ep.audio.url }">
            </audio>
          </div>
        </div>
      </div>
    `
  }).join('<div class="mt-3"></div>')

  const head = /* html */`
    <link rel="alternate" href="${ Deno.env.get('DOMAIN') }/${ podcast.slug }/feed" type="application/rss+xml" title="${ podcast.title }">
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

        @media (min-width: 768px) {
          .podcast-content {
            margin-top: 0 !important
          }
        }
    </style>
  `

  const foot = `
    <script>
      const player = Plyr.setup('.player');
    </script>
  `

  const final = layout({
    title: podcast.title,
    head,
    foot,
    content: /* html */`
    <div class="mt-3">
      <div class="row">
        <div class="col-12 col-md-3">
          <img class="w-100" src="${ podcast.cover_image_url }" />
        </div>
        <div class="podcast-content col-12 mt-3 col-md-9">
          <a href="/">Back to all podcasts</a>
          <h1 class="mt-3">${ podcast.title }</h1>
          <a href="/${ podcast.slug }/feed">RSS Feed</a>
          ${ podcast.links.map((lk, index) => `${ index == 0 ? '<br>' : '' }<a href="${ lk.link }">${ lk.name }</a>`).join('<br>') }
        </div>
      <p class="mt-3">${ podcast.description }</p>
      </div>
      <h2 class="mb-3">Episodes</h2>
      ${ episodeList }
    </div>
    `
  })

  return final
}