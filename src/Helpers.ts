import { DateTime } from 'https://cdn.skypack.dev/luxon'
import DB from './DB.ts'

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