import sodium from 'https://esm.sh/libsodium-wrappers@0.7.10'
import sql from '../backend/db.ts'

await sodium.ready

const salt_bytes = sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES)

const pw_hash = sodium.crypto_pwhash(
  sodium.crypto_box_SEEDBYTES, 
  Deno.args[1], 
  salt_bytes, 
  sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE, 
  sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
  sodium.crypto_pwhash_ALG_DEFAULT,
  'base64'
)

await sql`insert into users ${ sql({
  email: Deno.args[0],
  password: pw_hash,
  password_salt: sodium.to_base64(salt_bytes)
}) }`

console.log('inserted admin user '+Deno.args[0])

Deno.exit()