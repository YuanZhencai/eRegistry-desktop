<template>
    <div class='app-container'>
        <el-row>
            <el-col :span='24'>
                <el-button type='primary' class='float-right' @click="newQuestionnaire">创建问卷</el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-table stripe :data='questionnaires.slice((currentPage-1)*pageSize, currentPage*pageSize)'
                      :default-sort = "{prop: 'reportName', order: 'descending'}" height="250" style='width: 100%'>
                <el-table-column prop='reportName' label='问卷名称' width='180' sortable></el-table-column>
                <el-table-column prop='lastModifiedDate' label='更新时间' width='180' sortable></el-table-column>
                <el-table-column align="center">
                    <template slot="header" slot-scope="scope">
                        <span>操作</span>
                    </template>
                    <template slot-scope="scope">
                        <el-button type="text" @click="editQuestionnaire(scope.row.id)">编辑</el-button>
                        <el-divider direction="vertical"></el-divider>
                        <el-button type="text" @click="deleteQuestionnaire(scope.row)">删除</el-button>
                        <el-divider direction="vertical"></el-divider>
                        <el-button type="text">进行调查</el-button>
                        <el-divider direction="vertical"></el-divider>
                        <el-button type="text">调查结果</el-button>
                        <el-divider direction="vertical"></el-divider>
                        <el-button type="text">分享调查</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background layout="total, sizes, prev, pager, next, jumper"
                           :total="total" :page-size="pageSize" :page-sizes="[10,20,30,40,50]" :current-page="currentPage"
                           @current-change="currentChange" @size-change="sizeChange" class="pagination">
            </el-pagination>
        </el-row>
        <el-dialog title="确认删除问卷" v-if="deleteDialogVisible" :visible.sync="deleteDialogVisible" :before-close="closeDialog">
            <span>是否确认删除问卷 '{{selectedQuestionnaire.reportName}}' ？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteDialogVisible = false">删 除</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
  export default {
    name: 'ProjectQuestionnaire',
    data() {
      return {
        projectId: 20002,
        questionnaires: [],
        selectedQuestionnaire: null,
        total: 0,
        pageSize: 10, // 单页数据量
        currentPage: 1, // 默认开始页面
        deleteDialogVisible: false
      }
    },
    created() {
      this.getQuestionnaires()
    },
    methods: {
      currentChange: function(currentPage) {
        this.currentPage = currentPage
      },
      sizeChange: function(val) {
        this.pageSize = val
      },
      getQuestionnaires() {
        this.questionnaires = [{ id: 11, reportId: 20007, projectId: 20002, reportName: '患者调查表1', lastModifiedDate: '2018-08-10T01:37:05Z' }]
        this.total = this.questionnaires.length
      },
      newQuestionnaire() {
        this.$router.push({
          path: `/project/${this.projectId}/questionnaire-new`
        })
      },
      editQuestionnaire(questionnaireId) {
        this.$router.push({
          path: `/project/${this.projectId}/questionnaire/${questionnaireId}`
        })
      },
      deleteQuestionnaire(questionnaire) {
        this.selectedQuestionnaire = questionnaire
        this.deleteDialogVisible = true
      },
      closeDialog() {
        this.deleteDialogVisible = false
      }
    }
  }
</script>

<style scoped>

</style>
