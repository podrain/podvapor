import { convertTimeForFeed, sortByDateDescending } from '../helpers.ts'
import PodcastService from '../services/podcast_service.ts'

export default async function(slug) {
  const podcast = await (new PodcastService).getPodcastBySlug(slug)
  const episodes = await (new PodcastService).getEpisodes(podcast.id)

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:content="http://purl.org/rss/1.0/modules/content/">
        <channel>
            <title>${ podcast.title }</title>
            <description>${ podcast.description }</description>
            <language>en-us</language>
            <itunes:summary>${ podcast.description }</itunes:summary>
            <itunes:image href="${ Deno.env.get('DOMAIN') }/podcast/image/${ podcast.id }.png" />
            <link>${ Deno.env.get('DOMAIN') }/${ podcast.slug }</link>

            ${ podcast.categories.map(ct => {
              return `<itunes:category text="${ ct }" />`
            }).join('') }

            <itunes:owner>
                <itunes:name>${ podcast.owner.name }</itunes:name>
                <itunes:email>${ podcast.owner.email }</itunes:email>
            </itunes:owner>

            <itunes:author>${ podcast.author }</itunes:author>

            <itunes:explicit>${ podcast?.explicit ? 'true' : 'false' }</itunes:explicit>
            <copyright>${ podcast.copyright }</copyright>
            ${ episodes.sort(sortByDateDescending).map(ep => {
              return `
              <item>
                <guid isPermalink="false">${ ep.id }</guid>
                <title>${ ep.title }</title>
                <itunes:title>${ ep.title }</itunes:title>
                
                ${ ep?.description && `
                <itunes:summary>${ ep.description }</itunes:summary>
                <itunes:subtitle>${ ep.description }</itunes:subtitle>
                <description>${ ep.description }</description>
                ` }
                
                ${ ep?.notes && `<content:encoded><![CDATA[${ ep.notes }]]></content:encoded>` }
                
                <enclosure
                    length="${ ep.audio.length }"
                    type="${ ep.audio.type }"
                    url="${ Deno.env.get('DOMAIN') }/episode/audio/${ ep.id }.mp3"
                />
                <itunes:duration>${ ep.duration }</itunes:duration>
                <pubDate>${ convertTimeForFeed(ep.published) }</pubDate>
                <link>${ Deno.env.get('DOMAIN') }/${ podcast.slug }/${ ep.id }</link>
              </item>
              `
            }).join('') }
        </channel>
    </rss>
  `

  return feed
}