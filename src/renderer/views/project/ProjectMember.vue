<template>
    <div class='app-container'>
        <el-row>
            <el-col :span='24'>
                <el-button type='primary' class='float-right' @click="showNewDialog()">添加成员</el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-table stripe :data='tableData.slice((currentPage-1)*pageSize, currentPage*pageSize)'
                      :default-sort = "{prop: 'id', order: 'descending'}" style='width: 100%'>
                <el-table-column prop='id' label='ID' width='180' sortable></el-table-column>
                <el-table-column prop='username' label='用户名' width='180' sortable></el-table-column>
                <el-table-column prop='centerName' label='所属中心' sortable></el-table-column>
                <el-table-column label='任务'>
                    <template slot-scope="scope">{{ taskType[scope.row.task] }}</template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text">分配中心</el-button>
                        <el-divider direction="vertical"></el-divider>
                        <el-button type="text">分配任务</el-button>
                        <el-divider direction="vertical"></el-divider>
                        <el-button type="text" @click="delectDialogVisible=true">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background layout="total, sizes, prev, pager, next, jumper"
                           :total="total" :page-size="pageSize" :page-sizes="[10,20,30,40,50]" :current-page="currentPage"
                           @current-change="currentChange" @size-change="sizeChange" class="pagination">
            </el-pagination>
        </el-row>
        <el-dialog title="确认删除成员" :visible.sync="delectDialogVisible" :before-close="handleClose">
            <span>是否确认删除成员？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delectDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="delectDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <member-dialog-component :edit-dialog-visible="editDialogVisible" @closeDialog="closeDialog"></member-dialog-component>
    </div>
</template>

<script>
  import axios from 'axios'
  import MemberDialogComponent from './MemberDialogComponent'
  export default {
    components: { MemberDialogComponent },
    data() {
      return {
        productId: 20016,
        members: [],
        project: null,
        total: null,
        pageSize: 10, // 单页数据量
        currentPage: 1, // 默认开始页面
        taskType: {
          null: '',
          PATIENT: '录入',
          MASTER: '管理',
          AUDIT: '审核',
          VIEW: '查看',
          ADMIN: '负责人'
        },
        delectDialogVisible: false,
        editDialogVisible: false,
        tableData: [
          {
            createdBy: 'jiangyn',
            createdDate: '2019-09-05T01: 48: 03Z',
            lastModifiedBy: 'jiangyn',
            lastModifiedDate: '2019-09-05T01: 48: 03Z',
            id: 20015,
            username: 'jiangyn',
            centerName: ''
          },
          {
            createdBy: 'jiangyn',
            createdDate: '2019-09-30T07: 14: 18Z',
            lastModifiedBy: 'jiangyn',
            lastModifiedDate: '2019-09-30T07: 14: 18Z',
            id: 20060,
            username: 'user',
            task: 'PATIENT'
          },
          {
            createdBy: 'jiangyn',
            createdDate: '2019-09-20T06: 07: 11Z',
            lastModifiedBy: 'jiangyn',
            lastModifiedDate: '2019-09-20T06: 07: 11Z',
            id: 20031,
            username: 'yuanzhencai',
            task: 'PATIENT'
          }
        ]
      }
    },
    created() {
      // this.getMembers(this.productId)
      this.total = this.tableData.length
    },
    methods: {
      showNewDialog() {
        this.editDialogVisible = true
      },
      closeDialog() {
        this.editDialogVisible = false
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done()
          })
          .catch(_ => {})
      },
      getMembers(id) {
        axios.get(`https://192.168.3.247:20002/api/projects/${id}/members`)
          .then((response) => {
            console.log('success')
          }, (error) => {
            console.log(error)
          })
      },
      currentChange: function(currentPage) {
        this.currentPage = currentPage
      },
      sizeChange: function(val) {
        this.pageSize = val
      }
    }
  }
</script>

<style scoped>
    .float-right{
        float: right;
    }
    table th{
        background-color: #f2f2f2;
    }
    .pagination{
        margin-top: 10px;
        text-align: center;
    }
</style>

