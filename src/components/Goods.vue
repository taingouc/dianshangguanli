<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-input placeholder="请输入内容" style="width: 30%" v-model="queryInfo.query" clearable @clear="getGoodsList()">
        <el-button slot="append" icon="el-icon-search" @click="getGoodsList()"></el-button>
      </el-input>
      <el-button type="primary" style="margin-left: 20px" @click="addGoods()">添加商品</el-button>
      <el-table :data="goodsList" style="margin-top: 20px" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="110px"> </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="100px"> </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="160px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改商品" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除商品" placement="top">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total" background> </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Goods',
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1, // 第几分页
        pagesize: 10 // 每页显示多少条数据
      },
      // 商品列表
      goodsList: [],
      // 总数据条数
      total: 0
    }
  },
  methods: {
    // 根据分页获取对应的商品列表
    async getGoodsList() {
      const { data } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (data.meta.status !== 200) return this.$message.error('获取商品列表失败！')
      this.goodsList = data.data.goods
      this.total = data.data.total
    },
    // 每页显示多少条数据变更触发
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getGoodsList()
    },
    // 页码发生变化触发
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getGoodsList()
    },
    // 点击删除按钮
    async removeById(id) {
      const result = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)
      if (result === 'cancel') return this.$message.info('已取消删除！')
      const { data } = await this.$http.delete(`goods/${id}`)
      if (data.meta.status !== 200) return this.$message.error('删除失败！')
      this.$message.success('删除成功！')
      this.getGoodsList()
    },
    // 添加商品
    addGoods() {
      console.log('ok')
      // 跳转页面
      this.$router.push('/goods/add')
    }
  },
  created() {
    this.getGoodsList()
  }
}
</script>

<style lang="less" scoped>
.el-table {
  font-size: 12px;
}
.el-pagination {
  margin-top: 20px;
}
</style>
