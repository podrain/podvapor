import { Context } from './deps.ts'
import kv from './kv.ts'

export function isAuthenticated() {
  return async (ctx: Context, next: () => Promise<unknown>) => {
    if (await ctx.state.session.has('user_id')) {
      const authResult = await kv.get(['users', ctx.state.session.get('user_id')])
      if (authResult.value) {
        await next() 
      } else {
        ctx.response.redirect('/admin/login')
      }
    } else {
      ctx.response.redirect('/admin/login')
    }
  }
}