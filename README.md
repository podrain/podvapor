# Podvapor

:warning: *This product is in alpha, and documentation is not complete. Use at your own risk.*

Podvapor is a tool for hosting your podcast on the Deno Deploy™ serverless platform. The goal is to give podcasters the benefit of full control of their podcast feed, without many of the drawbacks of maintaining the feed themselves. 

However, it's also possible to host it on your own infrastructure. None of the code is proprietary and can be hosting on the Deno CLI platform.

[Deploy your podcast!](https://dash.deno.com/projects/podvapor/deploy)

## Features
- Serverless hosting
- No arbitrary limits on number of podcasts or episodes
- Total control of your feed, with the ability to customize if needed

## Requirements

- CockroachDB database
- Episode audio files with length, filetype, and duration metadata
- Deno Deploy™ environment variables

For now, Podvapor only provides hosting for your podcast feed. It doesn't create or host your audio files, or their associated metadata required by podcast feeds. That is still up to you. There may be more guidance on how to do this in the future.

### CockroachDB database

This guidance is not complete, more directions will be added soon. In the meantime, here is the CockroachDB create table commands.

```sql
# Create podcasts table
create table podcasts (
  id uuid default uuid_v4()::UUID primary key,
  title string,
  slug string,
  description string,
  cover_image_url string,
  categories jsonb,
  owner jsonb,
  links jsonb,
  author string,
  copyright string
)

# Create episodes table
create table episodes (
  id uuid default uuid_v4()::UUID primary key,
  podcast_id uuid references podcasts (id) on delete cascade,
  title string,
  description string,
  notes string,
  audio jsonb,
  duration int4,
  published string
)
```

### Episode audio files

You can host your audio files anywhere. A great place to host large files like this would be on Amazon S3 or an S3-compatible endpoint such as DigitalOcean Spaces, Linode Object Storage, or Vultr object storage. Even better if they are behind a CDN!

Get the URL for that audio file as well as the audio metadata and put them in the right column in the `episodes` table. Here are the audio-specific attributes:

- `audio.url` — web-accessible file URL
- `audio.length` — file length (filesize in bytes, not duration)
- `audio.type` — MIME type for audio file. Most of the time it will be `audio/mpeg`, but not always!
- `duration` — length of the audio, in seconds. This one is not under the `audio` property of the episode, since it's a root property of the episode, following the podcast RSS spec.

### Environment variables

Once you have your audio files at publicly-accessible URLs, as well as your DB set up, you'll also need to come up with a name for your podcast and determine the URL it will be hosted at.

In Deno Deploy™, create these ENVIRONMENT variables and fill in the appropriate values:

- `ENVIRONMENT` — `production`
- `DOMAIN` — The domain the of the site. This can be your own or one created [automatically by Deno Deploy™](https://deno.com/deploy/docs/projects#domains).
- `SITE_NAME` — The name for all your podcasts. This is like your "umbrella" name for all your podcasts. If you have only one podcast, this could be the name of your podcast.

## Costs

Since this project will be deployed directly on Deno Deploy™ with audio files hosted presumably hosted somewhere with an S3 endpoint, you will pay for Deno Deploy™ usage and your file hosting services directly. At this point, it will realistically cost about $5/month total for most hosts, since Deno Deploy™ is still free since it's in Beta and DigitalOcean Spaces and others charge about $5/month to host files.

No middleman fee for using this software :)

## Self-hosting

This project should be easy to self-host, since Deno Deploy™ is just a subset of the Deno CLI (for the most part). Instructions coming soon.

## Contributing

This project is in extremely early stages, so I don't have a formal process for handling contributions. As the project grows, it may formalize it a bit more.

## Example podcast

Here is a podcast currently hosted with this software. (The show host is the author of this software)

https://podcasts.sweeney.digital/devtales