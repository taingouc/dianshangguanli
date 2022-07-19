<template>
  <div class="login-container">
    <div class="login-box">
      <!-- logo图片区域 -->
      <div class="avater_box">
        <img src="../assets/logo.png" />
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="form" :model="loginForm" :rules="loginFormRules" class="login-form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input type="text" v-model="loginForm.username" placeholder="请填写用户名" prefix-icon="iconfont icon-user"> </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" placeholder="请填写密码" prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="login-btn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入登录用户名', trigger: 'blur' },
          { min: 5, max: 10, message: '长度在 5 到 10个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置表单
    resetForm() {
      this.$refs.form.resetFields()
    },
    // 点击登录
    login() {
      this.$refs.form.validate(async (valid) => {
        // valid为false,校验不通过
        if (!valid) return
        // 表单验证通过，发起axios请求登录
        try {
          const { data } = await this.$http.post('login', this.loginForm)
          if (data.meta.status === 200) {
            // 登录成功
            this.$message.success('登录成功')
            // 1.保存登录成功后的token到本地存储sessionStorage，token只在当前网站打开期间生效
            window.sessionStorage.setItem('token', data.data.token)
            // 2.除了登录以外的其他接口，必须在登录成功后才能访问,在路由对象中使用路由导航守卫
            // 3.通过编程式导航跳转到后台主页，路由地址/home
            this.$router.push('/home')
          } else {
            console.log(data)
            this.$message.error('登录失败,该用户不存在')
          }
        } catch (err) {
          this.$message.error('发生错误，登录失败！')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  height: 100%;
  background-color: #2b4b6b;
  .login-box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .avater_box {
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -40%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .login-form {
      padding: 0 20px;
      margin-top: 120px;
      .login-btn {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
