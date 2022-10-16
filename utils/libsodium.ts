import sodium from 'https://esm.sh/libsodium-wrappers@0.7.10'

await sodium.ready

const salt_bytes = sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES)

const pw_hash = sodium.crypto_pwhash(
  sodium.crypto_box_SEEDBYTES, 
  Deno.args[0], 
  salt_bytes, 
  sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE, 
  sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
  sodium.crypto_pwhash_ALG_DEFAULT,
  'base64'
)

console.log('hashed password (base64): '+pw_hash)
console.log('salt (base64): '+sodium.to_base64(salt_bytes))