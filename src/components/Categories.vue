<template>
  <div>
    <!-- 头部面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 内容卡片区域 -->
    <el-card class="box-card">
      <el-button type="primary" @click="addClassification">添加分类</el-button>
      <!-- table表格区域 -->
      <tree-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" :show-index="true" index-text="#" border>
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <template slot="isLevel" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <template slot="isOpt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <!-- 底部分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="40%" @close="addCateDialogClosed">
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name" clearable></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <!-- options用来指定数据源 -->
          <!-- props用来指定配置对象 -->
          <!-- v-model双向绑定选中的父级分类id数组 -->
          <el-cascader style="width: 100%" clearable v-model="selectedKeys" :options="parentCateList" :props="cascaderProps" @change="parentCateChanged"></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Categories',
  data() {
    return {
      // 商品分类的数据列表
      cateList: [],
      // 查询条件
      queryInfo: {
        type: 3, // 获取几级分类（1、2、3）
        pagenum: 1, // 当前页码值
        pagesize: 5 // 每页显示多少条数据
      },
      // 总数据条数
      total: 0,
      // 为table定义列
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          type: 'template',
          template: 'isLevel'
        },
        {
          label: '操作',
          type: 'template',
          template: 'isOpt'
        }
      ],
      // 控制添加分类对话框显示隐藏
      addDialogVisible: false,
      // 添加分类表单数据
      addCateForm: {
        cat_name: '', // 将要添加的分类名称
        cat_pid: 0, // 父级分类id
        cat_level: 0 // 分类的等级，默认添加一级分类
      },
      // 添加分类表单验证规则
      addCateFormRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id', // 指定选项的值为选项对象的某个属性值
        label: 'cat_name', // 指定选项标签为选项对象的某个属性值
        children: 'children', // 指定选项的子选项为选项对象的某个属性值
        expandTrigger: 'hover', // 鼠标经过触发
        checkStrictly: 'true' // 父子节点取消选中关联，从而达到选择任意一级选项的目的
      },
      // 选中的父级分类的id数组
      selectedKeys: []
    }
  },
  methods: {
    // 获取页面商品列表分类数据
    async getCateList() {
      const { data } = await this.$http.get('categories', { params: this.queryInfo })
      if (data.meta.status !== 200) return this.$message.error('获取商品分类列表失败！')
      this.cateList = data.data.result
      this.total = data.data.total
    },
    // 监听底部分页pagesize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 底部页码值pagenum改变
    handleCurrentChange(newPagenum) {
      this.queryInfo.pagenum = newPagenum
      this.getCateList()
    },
    // 添加分类按钮点击
    addClassification() {
      this.getParentCateList()
      this.addDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data } = await this.$http.get('categories', { params: { type: 2 } })
      if (data.meta.status !== 200) return this.$message.error('获取分类列表失败！')
      this.parentCateList = data.data
    },
    // select选择项发生变化触发
    parentCateChanged() {
      if (this.selectedKeys.length > 0) {
        // 选中了父级分类
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        // 未选中任何分类
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 添加分类对话框确认按钮点击,添加新的分类
    addCate() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return
        const { data } = await this.$http.post('categories', this.addCateForm)
        if (data.meta.status !== 201) return this.$message.error('创建失败！')
        this.getCateList()
        this.addDialogVisible = false
        this.$message.success('添加成功！')
      })
    },
    // 添加分类对话框关闭事件
    addCateDialogClosed() {
      // 重置表单
      this.$refs.addCateFormRef.resetFields()
      // 清空绑定的选择数组
      this.selectedKeys = []
      // 清空父级分类id
      this.addCateForm.cat_pid = 0
      // 清空分类的等级
      this.addCateForm.cat_level = 0
    }
  },
  created() {
    // 获取页面商品列表分类数据
    this.getCateList()
  }
}
</script>

<style lang="less" scoped>
.zk-table {
  margin-top: 15px;
}
</style>
