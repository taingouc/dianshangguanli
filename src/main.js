import Vue from 'vue'
import App from './App.vue'
import router from './router'
import TreeTable from 'vue-table-with-tree-grid'
import 'default-passive-events'
// 导入全局样式
import '@/assets/css/index.css'
// 导入element-ui
import './plugins/element.js'
// 导入字体图标
import '@/assets/fonts/iconfont.css'
// 导入nprogress包对应的js和css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// 导入axios
import axios from 'axios'
// 导入副文本编辑器vue-quill-editor
import VueQuillEditor from 'vue-quill-editor'
// 导入副文本编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 将副文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)
// 设置axios请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// axios拦截器，添加token
axios.interceptors.request.use((config) => {
  // 在request请求拦截器中展示进度条NProgress.start()
  NProgress.start()
  // 为请求头添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 在response响应拦截器中，隐藏进度条NProgress.done();
axios.interceptors.response.use((config) => {
  NProgress.done()
  return config
})
// 挂载到Vue实例的原型对象上
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

Vue.filter('dateFormat', function (oldtime) {
  const dt = new Date(oldtime)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
