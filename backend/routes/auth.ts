import { Router } from '../deps.ts'
import { parseFormParams } from '../helpers.ts'
import UserService from '../services/user_service.ts'
import SessionInertia from '../session_inertia.ts'
import { encode } from 'https://deno.land/std@0.160.0/encoding/base64url.ts'

const authRoutes = new Router()
  .use(
    ...SessionInertia
  )
  .post('/login-meta', async (ctx) => {
    const formParams = await parseFormParams(ctx)

    if (formParams.get('email')) {
      const user = await (new UserService).getUserByEmail(formParams.get('email')) as any

      ctx.response.body = {
        salt: user ? user.password_salt : encode(crypto.getRandomValues(new Uint8Array(16)))
      }
    }
  })
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
        if (formParams.get('password_hash') == user.password) {
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