import { DateTime } from 'https://cdn.skypack.dev/luxon@2.3.0'
import { Context } from './deps.ts'

export function convertTimeForFeed(time : string) {
  const newTime = DateTime.fromSQL(time).setZone('UTC', { keepLocalTime: true }).toRFC2822()
  return newTime
}

export function convertDateForWeb(time : string) {
  const newTime = DateTime.fromSQL(time).setZone('UTC', { keepLocalTime: true }).toLocaleString(DateTime.DATE_MED)
  return newTime
}

export function sortByDateDescending(a : any, b : any) {
  if (a.published > b.published) {
    return -1
  }

  if (a.published < b.published) {
    return 1
  }

  return 0
}

export async function parseFormParams(ctx : Context) {
  const params = new Map

  const requestBody = ctx.request.body()

  if (requestBody) {
    switch(requestBody.type) {
      case 'json':
        const jsonPayload = await requestBody.value

        for (const prop in jsonPayload) {
          params.set(prop, jsonPayload[prop])
        }
        break;
      case 'form':
        const formPayload = await requestBody.value
        formPayload.forEach((value : any, key : any) => {
          params.set(key, value)
        })
        break;
      case 'form-data':
        const formDataPayload = requestBody.value
        const formData = await formDataPayload.read()
        const fields = formData.fields

        for (const prop in fields) {
          params.set(prop, fields[prop])
        }
    }
  }

  return params
}

export async function manifest() {
  const file = await Deno.readTextFile(`${Deno.cwd()}/public/build/manifest.json`)
  const fileParsed = JSON.parse(file)
  return fileParsed
}