import Session from './session.ts'
import Inertia from './inertia.ts'
import { Context } from './deps.ts' 

export default [
  Session,
  Inertia.initMiddleware(),
  async (ctx: Context, next: () => Promise<unknown>) => {
    ctx.state.inertia.setShared({
      errors: await ctx.state.session.get('errors')
    })
    await next()
  }
] as const