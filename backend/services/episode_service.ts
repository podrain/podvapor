import sql from '../db.ts'

export default class EpisodeService {
  async getEpisode(episodeID : string) {
    const result = await sql`select * from episodes where id = ${episodeID}`
    const episode = result[0]
    return episode
  }
}