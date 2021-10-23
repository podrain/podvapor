import layout from './layout.ts'
import { getPodcasts } from '../Helpers.ts'

export default async function() {
  const podcasts = await getPodcasts()

  const podcastList = podcasts.map(pc => {
    return /* html */`
      <div class="card">
        <div class="card-body">
          <div class="d-flex">
            <div>
              <img style="width: 10rem;" src="${ pc.cover_image_url }" />
            </div>
            <div class="ms-3">
              <h5 class="card-title"><a href="/${ pc.slug }">${ pc.title }</a></h5>
              <a class="d-inline-block mt-2" href="/${ pc.slug }/feed">RSS Feed</a>
              ${ pc.links.map((lk, index) => `${ index == 0 ? '<br>' : '' }<a href="${ lk.link }">${ lk.name }</a>`).join('<br>') }
              <p class="card-text mt-3">${ pc.description }</p>
            </div>
          </div>
        </div>
      </div>
    `
  }).join()

  const content = /* html */`<div class="mt-3">
  <h1>${ Deno.env.get('OWNER') }'s Podcasts</h1>

  ${ podcastList }
</div>`

  return layout({
    content
  })
}