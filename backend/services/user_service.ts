
import sql from '../db.ts'

export default class UserService {
  async getUserByEmail(email : string) {
    const result = await sql`select * from users where email = ${email}`

    if (result.length > 0) {
      const user = result[0]
      return user
    } else {
      return null
    }
  }
}