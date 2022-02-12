import { Inertia } from 'https://deno.land/x/oak_inertia@v0.4.1/mod.ts'

export default new Inertia(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Podvapor Admin</title>
  <script type="module" src="http://localhost:3000/@vite/client"></script>
  <script type="module" src="http://localhost:3000/frontend/app.js"></script>
</head>
<body>
  @inertia
</body>
</html>`)