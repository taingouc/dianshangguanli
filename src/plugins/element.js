import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 弹框组价挂载到Vue实例的原型对象上，使用this.$message即可全局使用
Vue.prototype.$message = Message
