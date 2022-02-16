import { Client } from "https://deno.land/x/postgres@v0.15.0/mod.ts"
import 'https://deno.land/x/dotenv@v3.2.0/load.ts'
import { Context } from './deps.ts'

const db = new Client({
  hostname: Deno.env.get('DB_HOST'),
  port: Deno.env.get('DB_PORT'),
  user: Deno.env.get('DB_USER'),
  password: Deno.env.get('DB_PASS'),
  database: Deno.env.get('DB_DATABASE'),
  tls: {
    enabled: Deno.env.get('TLS_CERT_URL') ? true : false,
    caCertificates: [
      Deno.env.get('TLS_CERT_URL') ?? await (await fetch(Deno.env.get('TLS_CERT_URL') as string)).text()
    ],
  }
})

export function initDBMiddleware() {
  return async (ctx : Context, next: () => Promise<unknown>) => {
    await db.connect()
    await next()
    await db.end()
  }
}

export default db