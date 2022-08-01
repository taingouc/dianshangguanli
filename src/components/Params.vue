<template>
  <div>
    <!-- 头部导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 内容卡片区域 -->
    <el-card class="box-card">
      <!-- 头部警告 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false" show-icon> </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 级联选择框 -->
          <el-cascader v-model="selectedCateKeys" :options="cateList" :props="cateProps" @change="handleChange"></el-cascader>
        </el-col>
      </el-row>
      <!-- tabs页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="selectedCateKeys.length === 3 ? false : true" @click="addDialogVisible = true">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable @close="handleClose(index, scope.row)">{{ item }}</el-tag>
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"> </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="selectedCateKeys.length === 3 ? false : true" @click="addDialogVisible = true">添加属性</el-button>
          <!-- 静态参数表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable @close="handleClose(index, scope.row)">{{ item }}</el-tag>
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"> </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数的对话框 -->
    <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="40%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addRuleFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改操作对话框 -->
    <el-dialog :title="'修改' + titleText" :visible.sync="editDialogVisible" width="40%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editRuleFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Params',
  data() {
    return {
      // 商品分类列表
      cateList: [],
      // 级联选择框配置对象
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 级联选择框双向绑定到的数组
      selectedCateKeys: [],
      // tabs页签绑定的默认选中的页签
      activeName: 'many',
      // 动态参数表格数据
      manyTableData: [],
      // 静态参数表格数据
      onlyTableData: [],
      // 添加对话框的显示隐藏
      addDialogVisible: false,
      // 添加对话框表单数据
      addForm: {
        attr_name: ''
      },
      // 添加对话框表单验证规则
      addFormRules: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
      },
      // 编辑操作对话框显示隐藏
      editDialogVisible: false,
      // 编辑对话框表单数据
      editForm: {
        attr_name: ''
      },
      // 编辑对话框表单验证规则
      editFormRules: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 获取所有的商品分类列表
    async getCateList() {
      const { data } = await this.$http.get('categories')
      if (data.meta.status !== 200) return this.$message.error('获取商品分类失败！')
      this.cateList = data.data
    },
    // 级联选择框选择触发
    handleChange() {
      this.getParamsData()
    },
    // tabs页签点击事件处理函数
    handleClick() {
      this.getParamsData()
    },
    // 获取参数的列表数据
    async getParamsData() {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      // 根据分类的id和所处的面板获取对应的参数
      const { data } = await this.$http.get(`categories/${this.selectedCateKeys[2]}/attributes`, { params: { sel: this.activeName } })
      data.data.forEach((item) => {
        // 新增一个属性来控制输入文本框显示隐藏
        item.inputVisible = false
        // 新增一个属性存放文本框中输入的值
        item.inputValue = ''
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
      })
      if (data.meta.status !== 200) return this.$message.error('获取参数列表失败！')
      if (this.activeName === 'many') {
        this.manyTableData = data.data
      } else {
        this.onlyTableData = data.data
      }
    },
    // 添加对话框关闭事件
    addDialogClosed() {
      this.$refs.addRuleFormRef.resetFields()
    },
    // 添加对话框确定按钮
    addParams() {
      this.$refs.addRuleFormRef.validate(async (valid) => {
        if (!valid) return
        const { data } = await this.$http.post(`categories/${this.selectedCateKeys[2]}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (data.meta.status !== 201) return this.$message.error('添加参数失败！')
        this.$message.success('添加参数成功！')
        this.getParamsData()
        this.addDialogVisible = false
      })
    },
    // 编辑按钮点击
    async showEditDialog(id) {
      const { data } = await this.$http.get(`categories/${this.selectedCateKeys[2]}/attributes/${id}`, {
        params: {
          attr_sel: this.activeName
        }
      })
      if (data.meta.status !== 200) return this.$message.error('获取参数信息失败！')
      this.editForm = data.data
      this.editDialogVisible = true
    },
    // 监听编辑对话框关闭事件
    editDialogClosed() {
      this.$refs.editRuleFormRef.resetFields()
    },
    // 编辑对话框确定按钮点击
    editParams() {
      this.$refs.editRuleFormRef.validate(async (valid) => {
        if (!valid) return
        const { data } = await this.$http.put(`categories/${this.selectedCateKeys[2]}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        })
        if (data.meta.status !== 200) return this.$message.error('修改参数失败！')
        this.$message.success('修改参数成功！')
        this.getParamsData()
      })
      this.editDialogVisible = false
    },
    // 删除按钮
    async removeParams(id) {
      const result = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)
      console.log(result)
      if (result === 'cancel') return this.$message.info('已取消删除！')
      const { data } = await this.$http.delete(`categories/${this.selectedCateKeys[2]}/attributes/${id}`)
      if (data.meta.status !== 200) return this.$message.error('删除参数失败！')
      this.$message.success('删除参数成功！')
      this.getParamsData()
    },
    // 文本框失去焦点或者按下enter键触发
    async handleInputConfirm(row) {
      // 判断用户输入是否为空，为空则return出去
      if (row.inputValue.trim().length === 0) {
        // 清空文本框内容
        row.inputValue = ''
        // 隐藏文本框
        row.inputVisible = false
        return
      }
      // 用户输入了内容，添加标签
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // 发起请求提交编辑内容
      this.saveAttrVals(row)
    },
    async saveAttrVals(row) {
      // 发起请求提交编辑内容
      const { data } = await this.$http.put(`categories/${this.selectedCateKeys[2]}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(',')
      })
      if (data.meta.status !== 200) return this.$message.error('修改参数项失败！')
      this.$message.success('修改参数项成功！')
    },
    // 点击按钮展示文本输入框
    showInput(row) {
      row.inputVisible = true
      // $nextTick()作用：当页面上元素重新渲染后，才会执行其中代码
      this.$nextTick((_) => {
        // 文本框获得焦点
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 标签点击删除
    handleClose(index, row) {
      row.attr_vals.splice(index, 1)
      this.saveAttrVals(row)
    }
  },
  computed: {
    // 动态计算对话框标题
    titleText() {
      if (this.activeName === 'many') return '动态参数'
      return '静态属性'
    }
  },
  created() {
    // 获取所有的商品分类列表
    this.getCateList()
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 150px;
}
</style>
