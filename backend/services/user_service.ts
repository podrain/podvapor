import kv from '../kv.ts'

export default class UserService {
  async getUserByEmail(email : string) {
    const result = await kv.get(['users_by_email', email])

    if (result.value) {
      const user = result.value
      return user
    } else {
      return null
    }
  }
}