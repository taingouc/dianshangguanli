import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: () => import('@/components/Login') },
  { path: '/home', component: () => import('@/components/Home') }
]

const router = new VueRouter({
  routes
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // 如果将要访问的是登录页，直接放行
  if (to.path === '/login') return next()
  // 访问的是除了登录页的其他页面，判断有无token
  const tokenStr = window.sessionStorage.getItem('token')
  // 没有token，未登录，强制跳转至登录页
  if (!tokenStr) return next('/login')
  // 有token 直接放行
  next()
})

export default router
