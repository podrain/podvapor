import { Router } from '../deps.ts'
import inertia from '../inertia.ts'
import session from '../session.ts'
import { isAuthenticated } from '../auth.ts'

const adminRoutes = new Router()
.use(inertia.initMiddleware(), session.initMiddleware())
.get('/dashboard', isAuthenticated(), async (ctx) => {
  ctx.state.inertia.render('dashboard', {
    user_id: await ctx.state.session.get('user_id')
  })
})
.get('/', async (ctx) => {
  ctx.response.redirect('/admin/dashboard')
})

const adminRouter = new Router().get('/admin', adminRoutes.routes(), adminRoutes.allowedMethods())

export default adminRouter