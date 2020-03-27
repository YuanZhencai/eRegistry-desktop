<template>
    <div>
        <el-row v-if="$hasAnyAuthority(['PROJECT_ADMIN_' + projectId, 'PROJECT_MASTER_' + projectId])">
            <el-col :span='24'>
                <el-button type='primary' size="mini" class='float-right' @click="newCenter()">创建分中心</el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-table v-loading="loading" stripe :data='centers' style='width: 100%'>
                <el-table-column prop='id' label='ID'></el-table-column>
                <el-table-column prop='name' label='名称'></el-table-column>
                <el-table-column prop='no' label='编号'></el-table-column>
                <el-table-column prop='chargedBy' label='负责人'></el-table-column>
                <el-table-column label='中心人数'>
                    <template slot-scope="scope">{{ scope.row.memberCount || 0 }}</template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope" v-if="$hasAnyAuthority(['PROJECT_ADMIN_' + projectId, 'PROJECT_MASTER_' + projectId])">
                        <el-button type="text" @click="editCenter(scope.row)">编辑</el-button>
                        <el-divider direction="vertical"></el-divider>
                        <el-button type="text" @click="deleteCenter(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <el-row>
            <el-pagination background layout="total, prev, pager, next, jumper"
                           :total="total" :page-size="pageSize" :current-page="currentPage"
                           @current-change="currentChange" class="pagination">
            </el-pagination>
        </el-row>
        <el-dialog v-if="deleteCenterDialogVisible" width="500px" title="确认删除项目中心" :visible.sync="deleteCenterDialogVisible" :before-close="closeDialog">
            <span>是否确认删除中心 '{{this.selectedCenter.name}}' ？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteCenterDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmDelete" :disabled="isSaving">删 除</el-button>
            </span>
        </el-dialog>
        <center-dialog-component ref="center-dialog"></center-dialog-component>
    </div>
</template>

<script>
  import { getProjectCenters, deleteCenter } from '@/api/CenterService'
  import CenterDialogComponent from '../center/CenterDialogComponent'
  export default {
    name: 'ProjectCenter',
    components: { CenterDialogComponent },
    data() {
      const projectId = this.$route.params.projectId
      return {
        loading: true,
        predicate: '',
        order: '',
        centers: [],
        total: 0,
        pageSize: 10, // 单页数据量
        currentPage: 1, // 默认开始页面
        deleteCenterDialogVisible: false,
        selectedCenter: {},
        projectId,
        sortPropMap: {
          id: 'c.id',
          name: 'c.name',
          no: 'c.no',
          chargedBy: 'c.charged_by'
        },
        isSaving: false
      }
    },
    created() {
      this.getCenters()
    },
    methods: {
      sort() {
        return (this.predicate && this.order) ? this.sortPropMap[this.predicate] + ',' + (this.order === 'ascending' ? 'asc' : 'desc') : null
      },
      changeOrder(sort) {
        this.predicate = sort.prop
        this.order = sort.order
        this.getCenters()
      },
      getCenters() {
        this.loading = true
        getProjectCenters(this.projectId, {
          page: this.currentPage - 1,
          size: this.pageSize,
          sort: this.sort()
        }).then(response => {
          this.loading = false
          this.centers = response.data
          this.total = Number(response.headers['x-total-count'])
        })
      },
      newCenter() {
        this.selectedCenter = { name: '', telephone: '', no: '', chargedBy: '' }
        this.$refs['center-dialog'].show().then(() => {
          this.loading = true
          this.getCenters()
        }, () => {})
      },
      editCenter(center) {
        this.selectedCenter = center
        this.$refs['center-dialog'].show(center.id).then(() => {
          this.loading = true
          this.getCenters()
        }, () => {})
      },
      deleteCenter(center) {
        this.selectedCenter = center
        this.deleteCenterDialogVisible = true
      },
      currentChange: function(currentPage) {
        this.currentPage = currentPage
        this.getCenters()
      },
      closeDialog: function() {
        this.deleteCenterDialogVisible = false
      },
      confirmDelete() {
        this.isSaving = true
        deleteCenter(this.selectedCenter.id).then((res) => {
          this.isSaving = false
          this.closeDialog()
          this.loading = true
          this.getCenters()
        }, () => {
          this.isSaving = false
        })
      }
    }
  }
</script>

<style scoped>

</style>
