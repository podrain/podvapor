import { Session, CookieStore } from "./deps.ts"

const store = new CookieStore(Deno.env.get('APP_KEY'))

const session = new Session(store)

export default session