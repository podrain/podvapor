import { Session, PostgresStore } from "./deps.ts"
import 'https://deno.land/std@0.159.0/dotenv/load.ts'
import sql from './db.ts'

const store = new PostgresStore(sql)
await store.initSessionsTable()

export default Session.initMiddleware(store, {
  expireAfterSeconds: 900,
  cookieSetOptions: {
    sameSite: 'lax',
  },
})