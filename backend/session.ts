import { Session, PostgresStore } from "./deps.ts"
import 'https://deno.land/x/dotenv@v3.2.0/load.ts'
import sql from './db.ts'

const store = new PostgresStore(sql)
await store.initSessionsTable()

export default Session.initMiddleware(store, {
  expireAfterSeconds: 900,
  cookieSetOptions: {
    sameSite: 'lax',
    secure: new URL(Deno.env.get('DOMAIN') ?? 'http://localhost').protocol === 'https:' ? true : false
  }
})