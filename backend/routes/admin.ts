import { Router } from 'https://deno.land/x/oak@v10.2.0/mod.ts'
import inertia from '../inertia.ts'

const adminRoutes = new Router()
.use(inertia.initMiddleware())
.get('/', (ctx) => {
  ctx.state.inertia.render('dashboard', {})
})

const adminRouter = new Router().get('/admin', adminRoutes.routes(), adminRoutes.allowedMethods())

export default adminRouter