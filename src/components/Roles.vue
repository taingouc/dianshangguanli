<template>
  <div>
    <!-- 头部导航面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 内容卡片 -->
    <el-card class="box-card">
      <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
      <el-table :data="rolesList" border style="width: 100%" stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom', 'flex', index1 === 0 ? 'bdtop' : '']" v-for="(item1, index1) in scope.row.children" :key="item1.id">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeTagById(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限和三级权限 -->
              <el-col :span="19">
                <el-row v-for="(item2, index2) in item1.children" :key="item2.id" :class="['flex', index2 === 0 ? '' : 'bdtop']">
                  <el-col :span="6">
                    <el-tag closable type="success" @close="removeTagById(scope.row, item2.id)">
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag closable type="warning" v-for="(item3, index3) in item2.children" :key="item3.id" @close="removeTagById(scope.row, item3.id)">
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column prop="level" label="操作">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-tooltip class="item" effect="dark" content="编辑资料" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip class="item" effect="dark" content="删除角色" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="showDeleteDialog(scope.row)">删除</el-button>
            </el-tooltip>
            <!-- 分配权限按钮 -->
            <el-tooltip class="item" effect="dark" content="分配权限" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 点击分配权限的dialog对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
      <!-- 树形控件 -->
      <el-tree ref="treeRef" :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 点击编辑资料的dialog对话框 -->
    <el-dialog title="编辑资料" :visible.sync="editDialogVisible" width="50%">
      <el-form v-model="EditForm">
        <el-form-item label="角色名称 :" label-width="100px">
          <el-input v-model="EditForm.roleName" clearable></el-input>
        </el-form-item>
        <el-form-item label="角色描述 :" label-width="100px">
          <el-input v-model="EditForm.roleDesc" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="SubmitRoleData">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addForm" ref="addFormRef">
        <el-form-item label="角色名称 :" label-width="100px" prop="roleName">
          <el-input v-model="addForm.roleName" clearable></el-input>
        </el-form-item>
        <el-form-item label="角色描述 :" label-width="100px" prop="roleDesc">
          <el-input v-model="addForm.roleDesc" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="SubmitAddRoleData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  // 所有的角色列表
  data() {
    return {
      rolesList: [],
      // 控制分配权限对话框的显示隐藏
      setRightDialogVisible: false,
      // 分配权限数据
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中的节点id值数组
      defKeys: [],
      // 点击分配权限对应的角色id
      roleId: '',
      // 控制编辑资料对话框显示隐藏
      editDialogVisible: false,
      // 编辑资料表单数据
      EditForm: {
        roleId: 0, // 角色id，默认为0
        roleName: '', // 角色名称
        roleDesc: '' // 角色描述
      },
      // 添加角色对话框显示隐藏
      addDialogVisible: false,
      // 添加角色表单信息
      addForm: {
        roleName: '',
        roleDesc: ''
      }
    }
  },
  methods: {
    async getRolesList() {
      const { data } = await this.$http.get('roles')
      if (data.meta.status !== 200) return this.$message.error('获取角色列表失败！')
      this.rolesList = data.data
    },
    // 点击删除权限标签
    async removeTagById(role, rightId) {
      const result = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)
      if (result === 'cancel') return this.$message.info('已取消删除！')
      // 确认删除，发起请求
      const { data } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (data.meta.status !== 200) return this.$message.error('删除权限失败！')
      // 服务器返回的最新数据为列表重新赋值，不是调用getRolesList()重新获取数据，这样不会关闭标签窗口
      role.children = data.data
      this.$message.success('删除权限成功！')
    },
    // 点击分配权限按钮
    async showSetRightDialog(role) {
      this.roleId = role.id
      // 获取所有权限数据
      const { data } = await this.$http('rights/tree')
      if (data.meta.status !== 200) return this.$message.error('获取权限数据失败')
      this.rightsList = data.data
      // 获取所有三级节点的id
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的id，保存到defKeys数组中
    getLeafKeys(node, arr) {
      // 如果当前node节点中不包含children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => this.getLeafKeys(item, arr))
    },
    // 监听分配权限对话框关闭
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 点击确定为角色分配权限
    async allotRights() {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      // join() 方法用于把数组中的所有元素放入一个字符串
      const idStr = keys.join(',')
      const { data } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (data.meta.status !== 200) return this.$message.error('分配权限失败！')
      this.$message.success('分配权限成功！')
      this.getRolesList()
      this.setRightDialogVisible = false
    },
    // 点击编辑按钮
    async showEditDialog(role) {
      // 显示编辑资料对话框
      this.editDialogVisible = true
      // 根据id获取当前列用户信息
      const { data } = await this.$http.get(`roles/${role.id}`)
      if (data.meta.status !== 200) return this.$message.error('获取角色信息失败！')
      this.EditForm.roleName = data.data.roleName
      this.EditForm.roleDesc = data.data.roleDesc
      this.EditForm.roleId = data.data.roleId
    },
    // 点击编辑资料对话框确定按钮提交
    async SubmitRoleData() {
      if (this.EditForm.roleName == '') return this.$message.info('请输入角色名称！')
      const { data } = await this.$http.put(`roles/${this.EditForm.roleId}`, {
        roleName: this.EditForm.roleName,
        roleDesc: this.EditForm.roleDesc
      })
      if (data.meta.status !== 200) return this.$message.error('更新失败！请稍后重试！')
      this.$message.success('更新资料成功！')
      this.getRolesList()
      this.editDialogVisible = false
    },
    // 点击删除弹出消息确认对话框
    async showDeleteDialog(role) {
      const result = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)
      if (result === 'cancel') return this.$message.info('已取消删除')
      const { data } = await this.$http.delete(`roles/${role.id}`)
      if (data.meta.status !== 200) return this.$message.error('删除失败！')
      this.$message.success('删除成功！')
      this.getRolesList()
    },
    // 添加角色对话框关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加角色对话框确定按钮点击
    async SubmitAddRoleData() {
      if (this.addForm.roleName == '') return this.$message.info('角色名称不能为空！')
      const { data } = await this.$http.post('roles', {
        roleName: this.addForm.roleName,
        roleDesc: this.addForm.roleDesc
      })
      if (data.meta.status !== 201) return this.$$message.error('添加角色失败，请稍后重试！')
      this.$message.success('添加角色信息成功！')
      this.addDialogVisible = false
      this.getRolesList()
    }
  },
  created() {
    this.getRolesList()
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.flex {
  display: flex;
  align-items: center;
}
.el-table {
  margin-top: 15px;
}
</style>
