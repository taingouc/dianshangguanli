<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div id="main" style="width: 700px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
// 导入echarts
import * as echarts from 'echarts'
import _ from 'lodash'
export default {
  name: 'Reports',
  data() {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  methods: {},
  created() {},
  async mounted() {
    // mounted周期函数，此时，页面上的dom元素已经被渲染完毕了
    var myChart = echarts.init(document.getElementById('main'))
    const { data } = await this.$http.get('reports/type/1')
    if (data.meta.status !== 200) return this.$message.error('获取折线图数据失败！')
    // lodash的merge方法合并
    const result = _.merge(data.data, this.options)
    myChart.setOption(result)
  }
}
</script>

<style lang="less" scoped></style>
