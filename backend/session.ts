import { Session, CookieStore, createKeyFromBase64 } from "./deps.ts"
import 'https://deno.land/std@0.159.0/dotenv/load.ts'

const key_string = Deno.env.get('APP_KEY')
let key = null

if (key_string) {
  key = await createKeyFromBase64(key_string)
}

const store = new CookieStore(key)

export default Session.initMiddleware(store, {
  expireAfterSeconds: 900,
  cookieSetOptions: {
    sameSite: 'lax',
  },
})