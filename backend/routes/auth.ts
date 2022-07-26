import { Router } from '../deps.ts'
import { parseFormParams } from '../helpers.ts'
import UserService from '../services/user_service.ts'
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.3.0/mod.ts'
import SessionInertia from '../session_inertia.ts'

const authRoutes = new Router()
  .use(
    ...SessionInertia
  )
  .get('/login', 
    async (ctx, next) => {
      if (ctx.state.session.has('user_id')) {
          ctx.response.redirect('/admin/podcasts')
        } else {
          ctx.state.inertia.render('login')
        }
      })
  .post('/logout', async (ctx) => {
    ctx.state.session.deleteSession()
    ctx.response.redirect('/admin/login')
  })
  .post('/login', async (ctx, ) => {
    const formParams = await parseFormParams(ctx)

    if (formParams.get('email')) {
      const user = await (new UserService).getUserByEmail(formParams.get('email')) as any
      if (user) {
        if (await bcrypt.compareSync(formParams.get('password'), user.password)) {
          ctx.state.session.set('user_id', user.id)
          ctx.response.redirect('/admin/podcasts')
        } else {
          ctx.state.session.flash('errors', 'Wrong email or password.')
          ctx.response.redirect('/admin/login')
        }
      } else {
        ctx.state.session.flash('errors', 'Wrong email or password.')
        ctx.response.redirect('/admin/login')
      }
    } else {
      ctx.state.session.flash('errors', 'Email required.')
      ctx.response.redirect('/admin/login')
    }

  })

const authRouter = new Router().get('/admin', authRoutes.routes(), authRoutes.allowedMethods())

export default authRouter