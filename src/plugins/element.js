import Vue from 'vue'
import { Button, Form, FormItem, Input, Message, Container, Header, Aside, Main } from 'element-ui'
import { Menu, Submenu, MenuItem, Breadcrumb, BreadcrumbItem, Card, Row, Col } from 'element-ui'
import { Table, TableColumn, Switch, Tooltip, Pagination, Dialog, MessageBox, Tag, Tree } from 'element-ui'
import { Select, Option, Cascader } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)

// 弹框组价挂载到Vue实例的原型对象上，使用this.$message即可全局使用
Vue.prototype.$message = Message
// MessageBox要挂载到Vue实例的原型对象上
Vue.prototype.$confirm = MessageBox.confirm
