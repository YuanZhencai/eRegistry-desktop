<template>
  <div>
    <el-row>
      <el-col :span='24'>
        <el-button type='primary' class='float-right' size="mini" @click="newQuestionnaire">创建问卷</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-table v-loading="loading" stripe
                :data='questionnaires.slice((currentPage-1)*pageSize, currentPage*pageSize)'
                :default-sort="{prop: 'reportName', order: 'descending'}" height="250"
                style='width: 100%'>
        <el-table-column prop='reportName' label='问卷名称' width='180' sortable></el-table-column>
        <el-table-column label='更新时间' width='180' sortable>
          <template slot-scope="scope">{{scope.row.lastModifiedDate | formatDate('YYYY-MM-DD')}}</template>
        </el-table-column>
        <el-table-column align="center">
          <template slot="header" slot-scope="scope">
            <span>操作</span>
          </template>
          <template slot-scope="scope">
            <el-button type="text" @click="editQuestionnaire(scope.row.id)">编辑</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="text" @click="deleteQuestionnaire(scope.row)">删除</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="text" @click="patientInvestigation(scope.row.id)">进行调查</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="text">调查结果</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="text">分享调查</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <el-pagination background layout="prev, pager, next, jumper"
                     :total="total" :page-size="pageSize" :current-page="currentPage"
                     @current-change="currentChange" @size-change="sizeChange" class="pagination">
      </el-pagination>
    </el-row>
    <el-dialog title="确认删除问卷" v-if="deleteDialogVisible" :visible.sync="deleteDialogVisible"
               :before-close="closeDialog">
      <span>是否确认删除问卷 '{{selectedQuestionnaire.reportName}}' ？</span>
      <span slot="footer" class="dialog-footer">
                <el-button @click="deleteDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmDelete">删 除</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getProjectQuestionnaires, deleteQuestionnaire } from '@/api/QuestionnaireService'

  export default {
    name: 'ProjectQuestionnaire',
    data() {
      const projectId = this.$route.params.projectId
      return {
        loading: true,
        projectId: projectId,
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
        getProjectQuestionnaires(this.projectId, { page: this.currentPage - 1, size: this.pageSize }).then(response => {
          this.loading = false
          this.questionnaires = response.data
          this.total = this.questionnaires.length
        }).catch(error => {
          this.loading = false
          console.log(error)
        })
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
      patientInvestigation(questionnaireId) {
        this.$router.push({
          path: `/questionnaire/${questionnaireId}/investigation`
        })
      },
      deleteQuestionnaire(questionnaire) {
        this.selectedQuestionnaire = questionnaire
        this.deleteDialogVisible = true
      },
      closeDialog() {
        this.deleteDialogVisible = false
      },
      confirmDelete() {
        deleteQuestionnaire(this.selectedQuestionnaire.id).then((res) => {
          this.openMessage('问卷删除成功', 'success')
          this.closeDialog()
          this.loading = true
          this.getQuestionnaires()
        })
      },
      openMessage(message, type) {
        this.$message({
          message,
          type
        })
      }
    }
  }
</script>

<style scoped>

</style>
