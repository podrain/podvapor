import { Router } from 'https://deno.land/x/oak@v10.2.0/mod.ts'
import inertia from '../inertia.ts'

const adminRoutes = new Router()
.use(inertia.initMiddleware())
.get('/', (ctx) => {
  ctx.response.body = 'admin here'
})

const adminRouter = new Router().get('/admin', adminRoutes.routes(), adminRoutes.allowedMethods())

export default adminRouter