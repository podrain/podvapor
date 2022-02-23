import layout from './layout.ts'
import { getPodcasts } from '../helpers.ts'
import settings from '../settings.ts'

export default async function() {
  const podcasts = await getPodcasts()

  const podcastList = podcasts.map(pc => {
    return /* html */`
      <div class="flex flex-col p-4 w-full sm:flex-row">
        <div class="sm:w-1/3 md:w-1/4">
          <img class="w-100" src="${ pc.cover_image_url }" />
        </div>
        <div class="mt-4 sm:ml-4 sm:mt-0 sm:w-2/3 md:w-3/4">
          <h2 class="text-3xl"><a class="underline text-teal-100" href="/${ pc.slug }">${ pc.title }</a></h2>
          <a class="inline-block mt-4 underline text-teal-200" href="/${ pc.slug }/feed">RSS Feed</a>
          ${ pc.links.map((lk, index) => `${ index == 0 ? '<br>' : '' }<a class="underline text-teal-200" href="${ lk.link }">${ lk.name }</a>`).join('<br>') }
          <p class="mt-4">${ pc.description }</p>
        </div>
      </div>
    `
  }).join('<div class="mt-4"></div>')

  const content = /* html */`<div class="mt-4">
  <h1 class="px-4 text-3xl">${ await settings.get('site_name') }</h1>

  ${ podcastList }
</div>`

  return await layout({
    content
  })
}