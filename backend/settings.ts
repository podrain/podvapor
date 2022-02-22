import db from './db.ts'

export default {
  async get(key: string) {
    const result = await db.client.queryObject('select * from settings where key = $1', [key]) as any
    let value = null
    const resultRow = result.rows[0]

    if (resultRow.type == 'int') {
      value = parseInt(resultRow.value)
    } else {
      value = resultRow.value
    }

    return value
  },

  async set(key: string, value: string | number) {
    const result = await db.client.queryArray('update settings set value = $1 where key = $2', [
      value,
      key
    ])

    return result ? true : false
  }
}