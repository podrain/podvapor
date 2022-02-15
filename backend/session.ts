import { Session, CookieStore } from "./deps.ts"
import 'https://deno.land/x/dotenv@v3.2.0/load.ts'

const store = new CookieStore(Deno.env.get('APP_KEY'))

const session = new Session(store)

export default session