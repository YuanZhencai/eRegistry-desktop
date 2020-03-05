<template>
  <div class="app-container">
    <el-button type="primary">
      <router-link :to="''">
        创建CRF
      </router-link>
    </el-button>
    <el-table
        :data="reports"
        stripe
        @sort-change="changeOrder"
        style="width: 100%">
      <el-table-column
          prop="title"
          sortable="custom"
          label="标题">
      </el-table-column>
      <el-table-column
          prop="lastModifiedDate"
          sortable="custom"
          label="更新时间"
          width="180">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text">查看</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button type="text">删除</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button type="text">复制</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button type="text">分享</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @size-change="sizeChange"
        @current-change="loadPage"
        :current-page="page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalItems">
    </el-pagination>
  </div>
</template>

<script>
  import { getReports } from '../../api/ReportService'

  export default {
    name: 'Report',
    data() {
      return {
        reports: [],
        page: 1,
        previousPage: 1,
        size: 10,
        predicate: 'id',
        order: 'ascending',
        totalItems: null,
        queryCount: null,
        login: this.$store.getters.name
      }
    },
    mounted() {
      this.loadAll()
    },
    methods: {
      sort() {
        return (this.predicate && this.order) ? [this.predicate + ',' + (this.order === 'ascending' ? 'asc' : 'desc')] : []
      },
      loadAll() {
        getReports({
          page: this.page - 1,
          size: this.size,
          sort: this.sort(),
          'EQ_report.createdBy': this.login,
          'EQ_report.deleted': false
        }).then((res) => {
          this.reports = res.data
          this.totalItems = Number(res.headers['x-total-count'])
          this.queryCount = this.totalItems
        })
      },
      transition() {
        this.loadAll()
      },
      loadPage(page) {
        if (page !== this.previousPage) {
          this.previousPage = page
          this.transition()
        }
      },
      changeOrder(sort) {
        console.info(sort)
        this.predicate = sort.prop
        this.order = sort.order
        this.transition()
      },
      sizeChange(size) {
        this.size = size
        this.transition()
      }
    }
  }
</script>

<style scoped>

</style>
