let kv

if (Deno.env.has('DENO_DEPLOYMENT_ID')) {
  kv = await Deno.openKv()
} else {
  kv = await Deno.openKv('./kv/kv')
}


// const user = {
//   id: 'e8f41958-9f65-428d-affe-561464227291',
//   email: 'joe.sweeney224@gmail.com',
//   password: '2GoudaXgYnWygKpNBmZOOpNTbEIRZ0s1Wt9yALGcBD0',
//   password_salt: 'xHhn9wqon7PW4JNMOl1WyQ'
// }

// await kv
//   .atomic()
//   .set(['users', user.id], user)
//   .set(['users_by_email', user.email], user)
//   .commit()

export default kv