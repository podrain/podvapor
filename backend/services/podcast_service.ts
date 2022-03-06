import db from '../db.ts'

export default class PodcastService {
  async getPodcasts() {
    const result = await db.runQuery('select * from podcasts')
    let podcasts = result.rows
    return podcasts
  }

  async getPodcastBySlug(slug : string) {
    const result = await db.runQuery('select * from podcasts where slug = $1', [slug])
    const podcast = result.rows[0]
    return podcast
  }
  
  async getPodcast(id : string) {
    const result = await db.runQuery('select * from podcasts where id = $1', [id])
    const podcast = result.rows[0]
    return podcast
  }

  async getEpisodes(podcastID : string) {
    const result = await db.runQuery('select * from episodes where podcast_id = $1', [podcastID])
    const episodes = result.rows
    return episodes
  }
}