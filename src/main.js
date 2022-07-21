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
// 导入axios
import axios from 'axios'
// 设置axios请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// axios拦截器，添加token
axios.interceptors.request.use((config) => {
  // 为请求头添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 挂载到Vue实例的原型对象上
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)
new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
