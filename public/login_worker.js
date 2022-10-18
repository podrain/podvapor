import sodium from 'https://esm.sh/libsodium-wrappers@0.7.10'

onmessage = async function(e) {
  await sodium.ready
  const password = e.data.password
  const salt_base64 = e.data.salt_base64

  const salt_bytes = sodium.from_base64(salt_base64)

  const password_hashed = sodium.crypto_pwhash(
    sodium.crypto_box_SEEDBYTES, 
    password, 
    salt_bytes, 
    sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE, 
    sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_ALG_DEFAULT,
    'base64'
  )

  postMessage(password_hashed)
}