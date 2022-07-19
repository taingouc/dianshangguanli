<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../../public/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="loginOut">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isAside ? '64px' : '200px'">
        <!-- 侧边栏菜单按钮切换 -->
        <div class="toggle-button" @click="toggleMenu">|||</div>
        <!-- 侧边栏菜单 unique-opened设置为true,只保持一个子菜单的展开。collapse控制是否水平折叠收起菜单,collapse-transition为false,不开启折叠动画-->
        <el-menu :unique-opened="true" :collapse="isAside" :collapse-transition="false" router :default-active="activePath" background-color="#333744" text-color="#fff" active-text-color="#409EEF">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in MenuList" :key="item.id">
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path)">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      // 左侧菜单数据
      MenuList: [],
      // 一级菜单图标对象，id对应图标类名
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 侧边栏折叠
      isAside: false,
      // 二级菜单被点击的链接地址
      activePath: ''
    }
  },
  methods: {
    // 点击退出
    loginOut() {
      // 1.清除token
      window.sessionStorage.clear()
      // 2.跳转至登录页
      this.$router.push('/login')
      // 3.提示消息
      this.$message.success('退出登录！')
    },
    // 获取所有的菜单
    async getMenuList() {
      const { data } = await this.$http.get('menus')
      if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
      this.MenuList = data.data
    },
    // 点击按钮切换菜单折叠展开
    toggleMenu() {
      this.isAside = !this.isAside
    },
    // 二级菜单项被点击后，保存其路由地址到本地sessionStorage中，页面刷新保持之前的地址
    saveNavState(path) {
      window.sessionStorage.setItem('activePath', path)
      this.activePath = path
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  background-color: #373d41;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 15px;
}
.el-menu {
  border-right: unset;
}
.toggle-button {
  background-color: #4a5064;
  color: #fff;
  font-size: 10px;
  line-height: 24px;
  display: flex;
  justify-content: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
