import { Inertia } from './deps.ts'
import { manifest } from './helpers.ts'

export const template = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Podvapor Admin</title>
  ${ Deno.env.get('ENVIRONMENT') == 'local' 
  ? `
  <script type="module" src="http://localhost:5173/@vite/client"></script>
  <script type="module" src="http://localhost:5173/frontend/app.js"></script>
  `
  : `
  <link rel="stylesheet" href="/public/build/${ (await manifest())['frontend/app.js']['css'][0] }" />
  <script type="module" src="/public/build/${ (await manifest())['frontend/app.js']['file'] }" defer></script>
  `
  }
</head>
<body>
  @inertia
</body>
</html>`

export const checkVersion = () => {
  return Deno.env.get('INERTIA_VERSION') ?? 'initial'
}

export { Inertia }