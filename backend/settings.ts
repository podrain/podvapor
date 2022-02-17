import DB from './db.ts'

export default {
  async get(key: string) {
    const result = await DB.queryObject('select * from settings where key = $1', [key]) as any
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
    const result = await DB.queryArray('update settings set value = $1 where key = $2', [
      value,
      key
    ])

    return result ? true : false
  }
}