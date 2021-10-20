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