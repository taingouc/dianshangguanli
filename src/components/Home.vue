<template>
  <div class="home-container">
    <el-button type="info" @click="loginOut">退出</el-button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    // 点击退出
    loginOut() {
      // 1.清除token
      window.sessionStorage.clear()
      // 2.跳转至登录页
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped></style>
