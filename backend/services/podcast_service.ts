import sql from '../db.ts'

export default class PodcastService {
  async getPodcasts() {
    const result = await sql`select * from podcasts`
    let podcasts = result
    return podcasts
  }

  async getPodcastBySlug(slug : string) {
    const result = await sql`select * from podcasts where slug = ${slug}`
    const podcast = result[0]
    return podcast
  }
  
  async getPodcast(id : string) {
    const result = await sql`select * from podcasts where id = ${id}`
    const podcast = result[0]
    return podcast
  }

  async getEpisodes(podcastID : string) {
    const result = await sql`select * from episodes where podcast_id = ${podcastID}`
    const episodes = result
    return episodes
  }
}