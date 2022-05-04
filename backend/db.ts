import postgres from 'https://deno.land/x/postgresjs@v3.1.0/mod.js'
import 'https://deno.land/x/dotenv@v3.2.0/load.ts'

const sql = postgres({
  host: Deno.env.get('DB_HOST'),
  port: parseInt(Deno.env.get('DB_PORT') as string),
  database: Deno.env.get('DB_DATABASE'),
  user: Deno.env.get('DB_USER'),
  password: Deno.env.get('DB_PASS'),
  ssl: Deno.env.get('TLS_CERT_URL') ? true : false,
})

export default sql