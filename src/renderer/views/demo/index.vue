<template>
  <div>
    <el-row>
      <el-col :span="12">
        <div class="grid-content bg-purple-dark">
          <span style="border: 1px solid #409EFF"></span>
          <span style="margin-left: 5px;">患者调查</span>
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :span="12">
        <div style="display: flex;justify-content: flex-end;">
          <el-button type="primary">编辑</el-button>
          <el-button type="primary">进行调查</el-button>
          <el-button type="primary">删除</el-button>
          <el-button type="primary">分享调查</el-button>
          <el-button type="danger">告警</el-button>
          <el-button type="success">创建问卷</el-button>
        </div>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <div class="grid-content bg-purple-dark">
      <span style="border: 2px solid #cecbcb"></span>
      <span style="margin-left: 5px;">调查结果</span>
      <el-form :inline="true" class="demo-form-inline" style="margin-top: 10px;">
        <el-form-item>
          <el-input v-model="input" placeholder="请输入搜索内容" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="开始时间" v-model="begin"
                            style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-date-picker type="date" placeholder="结束时间" v-model="end"
                            style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      :default-sort = "{prop: 'date', order: 'descending'}"
    >
      <el-table-column
        prop="date"
        label="日期"
        sortable
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        sortable
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        :formatter="formatter">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: 'index',
    data() {
      return {
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }],
        value: '',
        begin: null,
        end: null,
        input: null
      }
    },
    methods: {
      formatter(row, column) {
        return row.address
      }
    }
  }
</script>

<style scoped>

</style>
