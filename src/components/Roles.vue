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
      <el-button type="primary">添加角色</el-button>
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
              <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip class="item" effect="dark" content="删除角色" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            </el-tooltip>
            <!-- 分配权限按钮 -->
            <el-tooltip class="item" effect="dark" content="分配权限" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog">分配权限</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 点击分配权限的dialog对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="30%">
      <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRightDialogVisible = false">确 定</el-button>
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
      rightsList: []
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
    async showSetRightDialog() {
      // 获取所有权限数据
      const { data } = await this.$http('rights/tree')
      if (data.meta.status !== 200) return this.$message.error('获取权限数据失败')
      this.rightsList = data.data
      this.setRightDialogVisible = true
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
</style>
