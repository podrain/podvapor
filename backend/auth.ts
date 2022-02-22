import { Context } from './deps.ts'
import db from './db.ts'

export function isAuthenticated() {
  return async (ctx: Context, next: () => Promise<unknown>) => {
    if (await ctx.state.session.has('user_id')) {
      const authResult = await db.runQuery('select * from users where id = $1', [await ctx.state.session.get('user_id')])
      if (authResult.rows.length > 0) {
        await next() 
      } else {
        ctx.response.redirect('/admin/login')
      }
    } else {
      ctx.response.redirect('/admin/login')
    }
  }
}