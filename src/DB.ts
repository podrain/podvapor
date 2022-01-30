import { Client } from "https://deno.land/x/postgres@v0.15.0/mod.ts"

if (Deno.env.get('DENO_DEPLOYMENT_ID') === undefined) {
  await import('https://deno.land/x/dotenv@v3.0.0/load.ts')
}

const db = new Client({
  hostname: Deno.env.get('DB_HOST'),
  port: Deno.env.get('DB_PORT'),
  user: Deno.env.get('DB_USER'),
  password: Deno.env.get('DB_PASS'),
  database: Deno.env.get('DB_DATABASE'),
  tls: {
    enabled: Deno.env.get('TLS_CERT_URL') ? true : false,
    caCertificates: [
      await (await fetch(Deno.env.get('TLS_CERT_URL') as string)).text()
    ],
  }
})

export default db