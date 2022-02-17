import layout from './layout.ts'
import { getPodcasts } from '../helpers.ts'
import settings from '../settings.ts'

export default async function() {
  const podcasts = await getPodcasts()

  const podcastList = podcasts.map(pc => {
    return /* html */`
      <div class="card">
        <div class="card-body">
          <div class="row">
            <div class="col-12 col-md-3">
              <img class="w-100" src="${ pc.cover_image_url }" />
            </div>
            <div class="podcast-content col-12 mt-3 col-md-9">
              <h5 class="card-title"><a href="/${ pc.slug }">${ pc.title }</a></h5>
              <a class="d-inline-block mt-2" href="/${ pc.slug }/feed">RSS Feed</a>
              ${ pc.links.map((lk, index) => `${ index == 0 ? '<br>' : '' }<a href="${ lk.link }">${ lk.name }</a>`).join('<br>') }
              <p class="card-text mt-3">${ pc.description }</p>
            </div>
          </div>
        </div>
      </div>
    `
  }).join('<div class="mt-3"></div>')

  const head = /* html */`<style>
  @media (min-width: 768px) {
    .podcast-content {
      margin-top: 0 !important
    }
  }
</style>`

  const content = /* html */`<div class="mt-3">
  <h1>${ await settings.get('site_name') }</h1>

  ${ podcastList }
</div>`

  return await layout({
    content,
    head
  })
}