import { DateTime } from 'https://cdn.skypack.dev/luxon'

export async function getPodcasts() {
  let podcasts = null

  if (Deno.env.get('ENVIRONMENT') == 'local') {
    const result = await Deno.readTextFile('./podcasts.json')
    podcasts = JSON.parse(result)
  } else {
    const result = await fetch(Deno.env.get('PODCASTS_URL') as string)
    const text = await result.text()
    podcasts = JSON.parse(text)
  }

  return podcasts
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