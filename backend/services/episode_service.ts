import db from '../db.ts'

export default class EpisodeService {
  async getEpisode(episodeID : string) {
    const result = await db.runQuery('select * from episodes where id = $1', [episodeID])
    const episode = result.rows[0]
    return episode
  }
}