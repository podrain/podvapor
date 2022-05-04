import { Session, PostgresStore } from "./deps.ts"
import 'https://deno.land/x/dotenv@v3.2.0/load.ts'
import sql from './db.ts'

const store = new PostgresStore(sql)
await store.initSessionsTable()

const session = new Session(store)

export default session