<template>
  <div class="app">
    <!--子路由占位符 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'MyApp'
}
</script>

<style lang="less" scoped>
.app {
  height: 100%;
}
</style>
