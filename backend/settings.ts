import sql from './db.ts'

export default {
  async get(key: string) {
    const result = await sql`select * from settings where key = ${key}`;
    let value = null
    const resultRow = result[0]

    if (resultRow.type == 'int') {
      value = parseInt(resultRow.value)
    } else {
      value = resultRow.value
    }

    return value
  },

  async set(key: string, value: string | number) {
    const result = await sql`update settings set value = ${value} where key = ${key}`

    return result ? true : false
  }
}