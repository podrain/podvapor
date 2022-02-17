import { Context } from './deps.ts'

export function isAuthenticated() {
  return async (ctx: Context, next: () => Promise<unknown>) => {
    if (await ctx.state.session.has('user_id')) {
      await next()
    } else {
      ctx.response.redirect('/admin/login')
    }
  }
}