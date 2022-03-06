import db from '../db.ts'

export default class UserService {
  async getUserByEmail(email : string) {
    const result = (await db.runQuery('select * from users where email = $1', [email]))
    const user = result.rows[0]
    return user
  }
}