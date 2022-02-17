import { Router } from '../deps.ts'
import inertia from '../inertia.ts'
import session from '../session.ts'
import { parseFormParams, getUserByEmail } from '../helpers.ts'
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.3.0/mod.ts'
import { initDBMiddleware } from '../db.ts'

const authRoutes = new Router()
  .use(
    initDBMiddleware(),
    session.initMiddleware(),
    inertia.initMiddleware(),
  )
  .get('/login',  async (ctx) => {
    if (await ctx.state.session.has('user_id')) {
      ctx.response.redirect('/admin/podcasts')
    } else {
      ctx.state.inertia.render('login')
    }
  })
  .post('/logout', async (ctx) => {
    await ctx.state.session.deleteSession()
    ctx.response.redirect('/admin/login')
  })
  .post('/login', async (ctx) => {
    const formParams = await parseFormParams(ctx)

    const user = await getUserByEmail(formParams.email) as any

    if (await bcrypt.compareSync(formParams.password, user.password)) {
      await ctx.state.session.set('user_id', user.id)
      ctx.response.redirect('/admin/podcasts')
    } else {
      await ctx.state.session.flash('errors', 'Wrong email or password.')
      ctx.response.redirect('/admin/login')
    }
  })

const authRouter = new Router().get('/admin', authRoutes.routes(), authRoutes.allowedMethods())

export default authRouter