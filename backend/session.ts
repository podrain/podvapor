import { Session, CookieStore, MemoryStore, SqliteStore } from "../../../Deno/session-2/mod.ts"
import { DB } from 'https://deno.land/x/sqlite@v2.4.0/mod.ts'

const store = new CookieStore('very-secret-key')
// const store = new MemoryStore()
// const sqlite = new DB('./database.db') 
// const store = new SqliteStore(sqlite)

const session = new Session(store)

export default session