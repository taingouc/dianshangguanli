import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: () => import('@/components/Login') },
  {
    path: '/home',
    redirect: '/welcome',
    component: () => import('@/components/Home'),
    children: [
      { path: '/welcome', component: () => import('@/components/Welcome') },
      { path: '/users', component: () => import('@/components/Users') },
      { path: '/roles', component: () => import('@/components/Roles') },
      { path: '/rights', component: () => import('@/components/Rights') },
      { path: '/goods', component: () => import('@/components/Goods') },
      { path: '/params', component: () => import('@/components/Params') },
      { path: '/categories', component: () => import('@/components/Categories') },
      { path: '/orders', component: () => import('@/components/Orders') },
      { path: '/reports', component: () => import('@/components/Reports') }
    ]
  }
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
