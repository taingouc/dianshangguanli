<template>
  <div>
    <!-- 头部面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体卡片 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input clearable placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table border stripe :data="userList" style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"> </el-table-column>
        <el-table-column label="邮箱" prop="email"> </el-table-column>
        <el-table-column label="电话" prop="mobile"> </el-table-column>
        <el-table-column label="角色" prop="role_name"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope)" active-color="#409EFF" inactive-color="#909399"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-tooltip class="item" effect="dark" content="修改资料" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip class="item" effect="dark" content="删除用户" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
            </el-tooltip>
            <!-- 分配角色按钮 -->
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部分页区域 -->
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
      </div>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="40%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile" clearable></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户资料的对话框 -->
    <el-dialog title="修改资料" :visible.sync="editDialogVisible" width="40%">
      <!-- 内容主体区域 -->
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="80px" class="demo-ruleForm">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile" clearable></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        return cb()
      }
      //返回一个错误提示
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        return cb()
      }
      //返回一个错误提示
      cb(new Error('请输入合法的手机号码'))
    }
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1, // 当前的页数
        pagesize: 2 // 当前每页显示数据条数
      },
      // 所有的用户列表
      userList: [],
      // 总数据条数
      total: 0,
      // 添加用户对话框的显示隐藏
      dialogVisible: false,
      // 修改资料对话框的显示隐藏
      editDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 修改资料的表单数据
      editForm: {},
      // 添加用户的表单验证规则
      addFormRules: {
        username: [
          { required: true, message: '请填写密码', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名的字符长度在3~10个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请填写用户名', trigger: 'blur' },
          { min: 6, max: 15, message: '密码的字符长度在6~15个字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请填写邮箱', trigger: 'blur' },
          { validator: checkEmail, message: '邮箱格式不正确，请重新输入', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请填写手机号', trigger: 'blur' },
          { validator: checkMobile, message: '手机号码不正确，请重新输入', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getUserList() {
      const { data } = await this.$http.get('users', { params: this.queryInfo })
      if (data.meta.status !== 200) return this.$message.error('获取用户列表失败！')
      this.userList = data.data.users
      this.total = data.data.total
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听状态按钮改变
    async userStateChange(userinfo) {
      const { data } = await this.$http.put(`users/${userinfo.row.id}/state/${userinfo.row.mg_state}`)
      if (data.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败！')
      }
      this.$message.success('更新用户状态成功！')
    },
    // 关闭添加用户对话框时，重置表单
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 确定按钮，发送请求添加用户
    addUser() {
      //调用validate进行表单验证
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('请填写完整用户信息')
        //发送请求完成添加用户的操作
        const { data } = await this.$http.post('users', this.addForm)
        //判断如果添加失败，就做提示
        if (data.meta.status !== 201) return this.$message.error('添加用户失败')
        //添加成功的提示
        this.$message.success('添加用户成功')
        //关闭对话框
        this.dialogVisible = false
        //重新请求最新的数据
        this.getUserList()
      })
    },
    // 点击修改资料按钮
    async showEditDialog(id) {
      // 根据id发起请求获取用户信息
      const { data } = await this.$http.get(`users/${id}`)
      if (data.meta.status !== 200) return this.$message.error('查询用户信息失败！')
      // 用户信息存储到data中渲染表单
      this.editForm = data.data
      // 展示修改资料对话框
      this.editDialogVisible = true
    },
    // 点击修改资料对话框确定按钮
    editUserInfo() {
      //调用validate进行表单验证
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('请填写完整用户信息')
        //发送请求完成用户资料更新的操作
        const { data } = await this.$http.put(`users/${this.editForm.id}`, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (data.meta.status !== 200) return this.$message.error('操作失败，请稍后重试！')
        // 关闭修改资料对话框
        this.editDialogVisible = false
        this.$message.success('更新用户信息成功！')
        //重新请求最新的数据
        this.getUserList()
      })
    },
    // 点击删除按钮
    async removeUserById(id) {
      // 弹框询问用户是否删除
      const data = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)
      // 用户点击确定 data为confirm
      // 用户点击取消 data为cancel
      if (data === 'cancel') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete(`users/${id}`)
      if (res.meta.status !== 200) return this.$message.error('删除失败，请稍后重试！')
      this.$message.success('删除用户成功！')
      //重新请求最新的数据
      this.getUserList()
    }
  },
  created() {
    this.getUserList()
  }
}
</script>

<style lang="less" scoped>
.input-with-select {
  background-color: #fff;
}
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
.el-pagination {
  margin-top: 15px;
}
</style>
