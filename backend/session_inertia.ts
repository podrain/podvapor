import Session from './session.ts'
import { Inertia, template, checkVersion } from './inertia.ts'
import { Context } from './deps.ts' 
import { nanoid } from 'https://esm.sh/nanoid@4.0.0/async'
import { parseFormParams } from './helpers.ts'

export default [
  Session,
  Inertia.initMiddleware(template, checkVersion),
  async (ctx: Context, next: () => Promise<unknown>) => {
    const form_params = await parseFormParams(ctx)
    const csrf_token = form_params.get('_csrf_token')

    if (ctx.request.method !== 'GET') { // modifying request
      if (csrf_token && (csrf_token == await ctx.state.session.get('_csrf_token'))) {
        await next()
      } else {
        ctx.response.status = 419
        ctx.response.body = 'Session expired'
      }
    } else { // GET request
      if (!await ctx.state.session.has('_csrf_token')) {
        const csrf_token = await nanoid()
        await ctx.state.session.set('_csrf_token', csrf_token)
      }

      await next()
    }
  },
  async (ctx: Context, next: () => Promise<unknown>) => {
    ctx.state.inertia.setShared({
      errors: await ctx.state.session.get('errors'),
      _csrf_token: await ctx.state.session.get('_csrf_token')
    })
    await next()
  }
] as const