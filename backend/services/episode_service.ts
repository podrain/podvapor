import kv from '../kv.ts'

export default class EpisodeService {
  async getEpisode(episodeID : string) {
    // const result = await sql`select * from episodes where id = ${episodeID}`
    // const episode = result[0]

    const episode = (await kv.get(['episodes', episodeID])).value

    return episode
  }
}