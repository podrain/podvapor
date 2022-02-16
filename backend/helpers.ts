import { DateTime } from 'https://cdn.skypack.dev/luxon'
import DB from './db.ts'

export async function getPodcasts() {
  const result = await DB.queryObject('select * from podcasts')
  let podcasts = result.rows
  return podcasts
}

export async function getPodcast(slug : string) {
  const result = (await DB.queryObject('select * from podcasts where slug = $1', [slug]))
  const podcast = result.rows[0]
  return podcast
}

export async function getPodcastById(id : string) {
  const result = (await DB.queryObject('select * from podcasts where id = $1', [id]))
  const podcast = result.rows[0]
  return podcast
}

export async function getEpisodes(podcastID : string) {
  const result = (await DB.queryObject('select * from episodes where podcast_id = $1', [podcastID]))
  const episodes = result.rows
  return episodes
}

export async function getEpisode(episodeID : string) {
  const result = (await DB.queryObject('select * from episodes where id = $1', [episodeID]))
  const episode = result.rows[0]
  return episode
}

export async function getUserByEmail(email : string) {
  const result = (await DB.queryObject('select * from users where email = $1', [email]))
  const user = result.rows[0]
  return user
}

export function convertTimeForFeed(time : string) {
  const newTime = DateTime.fromSQL(time).setZone('UTC', { keepLocalTime: true }).toRFC2822()
  return newTime
}

export function convertDateForWeb(time : string) {
  const newTime = DateTime.fromSQL(time).setZone('UTC', { keepLocalTime: true }).toLocaleString(DateTime.DATE_MED)
  return newTime
}

export function sortByDateDescending(a : any, b : any) {
  if (a.published > b.published) {
    return -1
  }

  if (a.published < b.published) {
    return 1
  }

  return 0
}

export async function parseFormParams(ctx : any) {
  let params : Record<string, any> = {}

  if (ctx.request.hasBody) {

    const requestBody = ctx.request.body()

    switch(requestBody.type) {
      case 'json':
        const jsonPayload = await requestBody.value

        params = jsonPayload
        break;
      case 'form':
        const formPayload = await requestBody.value
        formPayload.forEach((value : any, key : any) => {
          params[key] = value
        })
        break;
      case 'form-data':
        const formDataPayload = requestBody.value
        const formData = await formDataPayload.read()
        const fields = formData.fields

        for (const prop in fields) {
          params[prop] = fields[prop]
        }
    }
  }

  return params
}

export async function manifest() {
  const file = await Deno.readTextFile(`${Deno.cwd()}/public/build/manifest.json`)
  const fileParsed = JSON.parse(file)
  return fileParsed
}