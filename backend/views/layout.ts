interface PayloadOptions {
  title?: string,
  content: string,
  head?: string,
  foot?: string,
}

import settings from '../settings.ts'
import { manifest } from '../helpers.ts'

export default async function(payload : PayloadOptions) {
  return /* html */`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${ payload.title || await settings.get('site_name')}</title>
  ${ payload.head || ''}
  ${ Deno.env.get('ENVIRONMENT') == 'local' 
  ? `
  <script type="module" src="http://localhost:3000/@vite/client"></script>
  <script type="module" src="http://localhost:3000/frontend/app.js"></script>
  `
  : `
  <link rel="stylesheet" href="/public/build/${ (await manifest())['frontend/app.js']['css'][0] }" />
  `
  }
</head>
<body class="bg-gray-700 text-white">
  <div class="container mx-auto">
    ${ payload.content }
  </div>
  ${ payload.foot || ''}
</body>
</html>
  `
}