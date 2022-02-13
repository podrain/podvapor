import { Router } from '../deps.ts'
import inertia from '../inertia.ts'
import session from '../session.ts'
import { parseFormParams, getUserByEmail } from '../helpers.ts'
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.3.0/mod.ts'
import db from '../db.ts'

const adminRoutes = new Router()
.use(inertia.initMiddleware(), session.initMiddleware())
.get('/dashboard', async (ctx) => {
  if (await ctx.state.session.has('user_id')) {
    ctx.state.inertia.render('dashboard', {
      user_id: await ctx.state.session.get('user_id')
    })
  } else {
    ctx.response.redirect('/admin/login')
  }
})
.get('/login', async (ctx) => {
  if (await ctx.state.session.has('user_id')) {
    ctx.response.redirect('/admin/dashboard')
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

  const user = await getUserByEmail(formParams.get('email'))

  if (await bcrypt.compare(formParams.get('password'), user.password)) {
    await ctx.state.session.set('user_id', user.id)
    ctx.response.redirect('/admin/dashboard')
  } else {
    await ctx.response.redirect('/admin/login')
  }
})
.get('/', async (ctx) => {
  ctx.response.redirect('/admin/dashboard')
})

const adminRouter = new Router().get('/admin', adminRoutes.routes(), adminRoutes.allowedMethods())

export default adminRouter