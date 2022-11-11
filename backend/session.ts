import { Session, PostgresStore } from "./deps.ts"
import 'https://deno.land/std@0.159.0/dotenv/load.ts'
import sql from './db.ts'
import { createKeyFromBase64 } from "./deps.ts"

const store = new PostgresStore(sql)
await store.initSessionsTable()

let key

try {
  key = await createKeyFromBase64(Deno.env.get('APP_KEY') || '')
} catch {
  key = null
}

export default Session.initMiddleware(store, {
  expireAfterSeconds: 900,
  cookieSetOptions: {
    sameSite: 'lax',
  },
  encryptionKey: key
})