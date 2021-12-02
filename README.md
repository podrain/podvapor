# Podvapor

Podvapor is a tool for hosting your podcast on the Deno Deploy™ serverless platform. The goal is to give podcasters the benefit of full control of their podcast feed, without the drawbacks of dealing with maintaining the feed themselves. 

However, it's also possible to host it on your own infrastructure.

## Features
- Serverless hosting
- No arbitrary limits on number of podcasts or episodes
- Total control of your feed, with the ability to customize if needed

## Requirements

- JSON file with podcast data, accessible via URL
- Episode audio files with length, filetype, and duration metadata
- Deno Deploy environment variables

For now, Podvapor only provides hosting for your podcast feed. It doesn't create or host your audio files, or their associated metadata required by podcast feeds. That is still up to you. There may be more guidance on how to do this in the future.

### JSON file

Here is the formatting for a single podcast with a single episode. Fill in the values with the details of your podcasts and episodes. All these fields are required so that they show up in Apple, Spotify, and Google Podcast properly.

Episodes will always be ordered by publish date, so their order doesn't matter in the `episodes` array.

```json
[
  {
    "title": "My Podcast",
    "slug": "my-podcast",
    "description": "Eye-catching description of my podcast!",
    "cover_image_url": "https://example.com/cover_image.png",
    "categories": [
      "Technology"
    ],
    "owner": {
      "name": "John Doe",
      "email": "jdoe@example.com"
    },
    "links": [
      {
        "name": "Apple",
        "link": "https://podcasts.apple.com/us/podcast/my-podcast/id1234567890"
      },
      {
        "name": "Spotify",
        "link": "https://open.spotify.com/show/1234567890abcdef"
      },
      {
        "name": "Google Podcasts",
        "link": "https://www.google.com/podcasts?feed=RaNd0m5tRiNg"
      }
    ],
    "author": "John Doe",
    "copyright": "©2021 J-Dizzle Productions",
    "episodes": [
      {
        "guid": "something-random-and-unique",
        "title": "Greatest Podcast Episode",
        "description": "This is what will show up on most feeds as a short summary of what the episode is about, but it varies by reader.",
        "notes": "<p>This can contain HTML, with links, etc. for longer show-notes.</p>",
        "audio": {
          "url": "https://s3-compatible-endpoint.com/episode.mp3",
          "length": 54489448,
          "type": "audio/mpeg"
        },
        "duration": 2265,
        "published": "2021-11-30 06:00:00"
      }
    ]
  }
]
```

### Episode audio files

You can host your audio files anywhere. A great place to host large files like this would be on Amazon S3 or an S3-compatible endpoint such as DigitalOcean Spaces, Linode Object Storage, or Vultr object storage. Even better if they are behind a CDN!

Get the URL for that audio file as well as the audio metadata and put them in the right spot in the JSON file. Here are the audio-specific attributes:

- `audio.url` — web-accessible file URL
- `audio.length` — file length (filesize in bytes, not duration)
- `audio.type` — MIME type for audio file. Most of the time it will be `audio/mpeg`, but not always!
- `duration` — length of the audio, in seconds. This one is not under the `audio` property of the episode, since it's a root property of the episode, following the podcast RSS spec.

### Environment variables

Once you have your audio files at publicly-accessible URLs, as well as your JSON file, you'll also need to come up with a name for your podcast and determine the URL it will be hosted at.

In Deno Deploy, create these ENVIRONMENT variables and fill in the appropriate values:

- `ENVIRONMENT` — `production`
- `DOMAIN` — The domain the of the site. This can be your own or one created [automatically by Deno Deploy](https://deno.com/deploy/docs/projects#domains).
- `PODCASTS_URL` — The public URL for the the JSON file you created earlier. This is the "database" for the app, and will be fetched and parsed as raw text. When you want to add episodes or otherwise update your feed, you'll just have to edit this file. I would also recommend storing this in an S3-compatible storage endpoint, but you could even just store it as a Github Gist!
- `SITE_NAME` — The name for all your podcasts. This is like your "umbrella" name for all your podcasts.

## Costs

Since this project will be deployed directly on Deno Deploy with audio files hosted presumably hosted somewhere with an S3 endpoint, you will pay for Deno Deploy usage and your file hosting services directly. At this point, it will realistically cost about $5/month total for most hosts, since Deno Deploy is still free since it's in Beta and DigitalOcean Spaces and others charge about $5/month to host files.

No middleman fee for using this software :)

## Self-hosting

This project should be easy to self-host, since Deno Deploy is just a subset of the Deno CLI (for the most part). Instructions coming soon.

## Contributing

This project is in extremely early stages, so I don't have a formal process for handling contributions. As the project grows, it may formalize it a bit more.