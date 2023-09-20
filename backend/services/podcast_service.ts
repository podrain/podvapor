import kv from '../kv.ts'

export default class PodcastService {
  async getPodcasts() {
    const iter = await kv.list({ prefix: ['podcasts'] })
    let podcasts = []

    for await (const res of iter) podcasts.push(res.value)

    return podcasts
  }

  async getPodcastBySlug(slug : string) {
    const podcast = (await kv.get(['podcasts_by_slug', slug])).value
    return podcast
  }
  
  async getPodcast(id : string) {
    const podcast = (await kv.get(['podcasts', id])).value
    return podcast
  }

  async getEpisodes(podcastID : string) {
    const iter = await kv.list({ prefix: ['episodes_by_podcast_id', podcastID]})
    const episodes = []

    for await (const res of iter) episodes.push(res.value)

    return episodes
  }
}