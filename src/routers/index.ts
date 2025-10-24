import { createRouter, createWebHashHistory } from 'vue-router'
import { Session } from '@/utils/storage'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { staticRoutes, notFoundAndNoPower, adminRoutes } from '@/routers/routes'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [...staticRoutes, ...adminRoutes, ...notFoundAndNoPower],
})

NProgress.configure({ showSpinner: false })
router.beforeEach((to, from, next) => {
  if (to.meta.title) NProgress.start()

  const token = Session.get('token')

  if (token) {
    // User is authenticated
    if (to.path === '/login') {
      // If trying to access loroutegin page, redirect to home
      next({ path: '/dashboard' })
    } else {
      // Otherwise, allow navigation
      next()
    }
  } else {
    // User is not authenticated
    if (to.path === '/login') {
      // If going to login, allow it
      next()
    } else {
      // Otherwise, redirect to login
      next(`/login`)
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

export default router
