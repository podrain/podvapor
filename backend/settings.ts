import kv from './kv.ts'

export default {
  async get(key: string) {
    let value = null

    const result = await kv.get(['settings', key])

    if (result) {
      if (result.value.type == 'int') {
        value = parseInt(result.value.value)
      } else {
        value = result.value.value
      }
    }

    return value
  },

  async set(key: string, value: string | number) {
    const setting = (await kv.get(['settings', key])).value
    setting.value = value
    const result = await kv.set(['settings', key], setting)
    return result ? true : false
  }
}