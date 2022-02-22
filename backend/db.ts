import { Client, Pool, PoolClient } from "https://deno.land/x/postgres@v0.15.0/mod.ts"
import 'https://deno.land/x/dotenv@v3.2.0/load.ts'
import { Context } from './deps.ts'

class Database {
  pool!: Pool
  client!: PoolClient

  async initPool() {
    this.pool = new Pool({
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
    }, 3, true)
  }

  async runQuery(query : string, args: Array<unknown> = []) {
    const client = await this.pool.connect()
    let result
    try {
      result = await client.queryObject(query, args)
    } finally {
      client.release()
    }
    return result
  }
}

const db = new Database()
await db.initPool()

export default db