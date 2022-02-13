import { Context, Router } from './deps.ts'
import inertia from './inertia.ts'
import session from './session.ts'
import { parseFormParams, getUserByEmail } from './helpers.ts'
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.3.0/mod.ts'

export function isAuthenticated() {
  return async (ctx: Context, next: () => Promise<unknown>) => {
    if (await ctx.state.session.has('user_id')) {
      await next()
    } else {
      ctx.response.redirect('/admin/login')
    }
  }
}

const authRoutes = new Router()
  .use(session.initMiddleware())
  .get('/login', inertia.initMiddleware(), async (ctx) => {
    if (await ctx.state.session.has('user_id')) {
      ctx.response.redirect('/admin/podcasts')
    } else {
      ctx.state.inertia.render('login')
    }
  })
  .post('/logout', async (ctx, next) => {
    await ctx.state.session.deleteSession()
    ctx.response.redirect('/admin/login')
  })
  .post('/login', async (ctx) => {
    const formParams = await parseFormParams(ctx)

    const user = await getUserByEmail(formParams.get('email')) as any

    if (await bcrypt.compare(formParams.get('password'), user.password)) {
      await ctx.state.session.set('user_id', user.id)
      ctx.response.redirect('/admin/podcasts')
    } else {
      await ctx.response.redirect('/admin/login')
    }
  })

const authRouter = new Router().get('/admin', authRoutes.routes(), authRoutes.allowedMethods())

export { authRouter }