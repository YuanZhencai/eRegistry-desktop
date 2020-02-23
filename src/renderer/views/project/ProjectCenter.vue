<template>
    <div class='app-container'>
        <el-row>
            <el-col :span='24'>
                <el-button type='primary' class='float-right' @click="newCenter()">创建分中心</el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-table stripe :data='centers.slice((currentPage-1)*pageSize, currentPage*pageSize)'
                      :default-sort = "{prop: 'id', order: 'descending'}" style='width: 100%'>
                <el-table-column prop='id' label='ID' sortable></el-table-column>
                <el-table-column prop='name' label='名称' sortable></el-table-column>
                <el-table-column prop='no' label='编号' sortable></el-table-column>
                <el-table-column prop='chargedBy' label='负责人' sortable></el-table-column>
                <el-table-column label='中心人数'>
                    <template slot-scope="scope">{{ scope.row.memberCount || 0 }}</template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="editCenter(scope.row)">编辑</el-button>
                        <el-divider direction="vertical"></el-divider>
                        <el-button type="text" @click="deleteCenter(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background layout="total, sizes, prev, pager, next, jumper"
                           :total="total" :page-size="pageSize" :page-sizes="[10,20,30,40,50]" :current-page="currentPage"
                           @current-change="currentChange" @size-change="sizeChange" class="pagination">
            </el-pagination>
        </el-row>
        <el-dialog v-if="deleteCenterDialogVisible" title="确认删除项目中心" :visible.sync="deleteCenterDialogVisible" :before-close="closeDialog">
            <span>是否确认删除项目 '{{this.selectedCenter.name}}' ？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteCenterDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteCenterDialogVisible = false">删 除</el-button>
            </span>
        </el-dialog>
        <center-dialog-component v-if="centerDialogVisible" :visible="centerDialogVisible" :center="selectedCenter" @closeDialog="closeDialog"></center-dialog-component>
    </div>
</template>

<script>
  import { getProjectCenters } from '@/api/CenterResource'
  import CenterDialogComponent from '../center/CenterDialogComponent'
  export default {
    name: 'ProjectCenter',
    components: { CenterDialogComponent },
    data() {
      return {
        centers: [],
        total: 0,
        pageSize: 10, // 单页数据量
        currentPage: 1, // 默认开始页面
        deleteCenterDialogVisible: false,
        centerDialogVisible: false,
        selectedCenter: null,
        projectId: 20002
      }
    },
    created() {
      this.getCenters()
    },
    methods: {
      getCenters() {
        getProjectCenters(this.projectId).then(response => {
          this.centers = response.data
          this.total = this.centers.length
        })
      },
      newCenter() {
        this.selectedCenter = { id: null, name: null, telephone: null, chargedBy: null }
        this.centerDialogVisible = true
      },
      editCenter(center) {
        this.selectedCenter = center
        this.centerDialogVisible = true
      },
      deleteCenter(center) {
        this.selectedCenter = center
        this.deleteCenterDialogVisible = true
      },
      currentChange: function(currentPage) {
        this.currentPage = currentPage
      },
      sizeChange: function(val) {
        this.pageSize = val
      },
      closeDialog: function(val) {
        switch (val) {
          case 'centerDialog':
            this.centerDialogVisible = false
            break
          default:
            this.deleteCenterDialogVisible = false
        }
      }
    }
  }
</script>

<style scoped>

</style>
