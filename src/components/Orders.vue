<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-input placeholder="请输入内容" style="width: 30%">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="create_time">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改订单地址" placement="top">
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="showBox"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="物流进度" placement="top">
              <el-button type="success" size="mini" icon="el-icon-location" @click="showProgressBox"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </el-card>
    <!-- 修改订单地址对话框 -->
    <el-dialog title="修改地址" :visible.sync="addressVisible" width="40%" @close="addressDialogClosed">
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1" style="width: 100%"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流进度对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="40%">
      <!-- timeline时间线 -->
      <el-timeline>
        <el-timeline-item v-for="(item, index) in progressInfo" :key="index" :timestamp="item.time">
          {{ item.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from '@/assets/js/citydata.js'
export default {
  name: 'Orders',
  data() {
    return {
      // 查询条件
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderList: [],
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [{ required: true, message: '请选择省市区县', trigger: 'blur' }],
        address2: [{ required: true, message: '请填写详细地址', trigger: 'blur' }]
      },
      cityData: cityData,
      progressVisible: false,
      progressInfo: []
    }
  },
  methods: {
    async getOrderList() {
      const { data } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (data.meta.status !== 200) return this.$message.error('获取订单列表失败！')
      this.total = data.data.total
      this.orderList = data.data.goods
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newPageNum) {
      this.queryInfo.pagenum = newPageNum
      this.getOrderList()
    },
    showBox() {
      this.addressVisible = true
    },
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    async showProgressBox() {
      const { data } = await this.$http.get('/kuaidi/1106975712662')
      if (data.meta.status !== 200) return this.$message.error('获取物流信息失败！')
      this.progressInfo = data.data
      this.progressVisible = true
    }
  },
  created() {
    this.getOrderList()
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 20px;
}
.el-pagination {
  margin-top: 20px;
}
</style>
