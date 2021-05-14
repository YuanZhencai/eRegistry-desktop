<template>
  <div>
    <el-row v-if="$hasAnyAuthority(['PROJECT_ADMIN_' + projectId, 'PROJECT_PATIENT_' + projectId])">
      <el-col :span='24'>
        <el-button type='primary' class='float-right' size="mini" @click="newQuestionnaire">创建问卷</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-table v-loading="loading" stripe
                :data='questionnaires' @sort-change="changeOrder"
                style='width: 100%'>
        <el-table-column prop='reportName' label='问卷名称' width='180' sortable="custom"></el-table-column>
        <el-table-column prop="lastModifiedDate" label='更新时间' width='180' sortable="custom">
          <template slot-scope="scope">{{scope.row.lastModifiedDate | formatDate('YYYY-MM-DD HH:mm')}}</template>
        </el-table-column>
        <el-table-column align="center">
          <template slot="header" slot-scope="scope">
            <span>操作</span>
          </template>
          <template slot-scope="scope">
            <template v-if="$hasAnyAuthority(['PROJECT_ADMIN_' + projectId, 'PROJECT_PATIENT_' + projectId])">
              <el-button type="text" @click="editQuestionnaire(scope.row.id)">编辑</el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button type="text" @click="deleteQuestionnaire(scope.row)">删除</el-button>
              <el-divider direction="vertical"></el-divider>
            </template>
            <el-button type="text" @click="newInvestigation(scope.row.id)">进行调查</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="text" @click="investigation(scope.row.id)">调查结果</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-popover
                    placement="left"
                    title="调查二维码"
                    width="200"
                    trigger="hover">
              <el-image
                      style="width: 150px; height: 150px"
                      :src="`/#/questionnaire/${scope.row.id}/investigation-new` | qrcode"
                      :fit="'fill'">
              </el-image>
              <el-button type="text" slot="reference">分享调查</el-button>
			</el-popover>
			  <el-divider direction="vertical"></el-divider>
			  <el-button type="text" @click="alert(scope.row.id)">告警</el-button>
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
    <el-dialog title="确认删除问卷" width="500px" v-if="deleteDialogVisible" :visible.sync="deleteDialogVisible"
               :before-close="closeDialog">
      <span>是否确认删除问卷 '{{selectedQuestionnaire.reportName}}' ？</span>
      <span slot="footer" class="dialog-footer">
                <el-button @click="deleteDialogVisible = false">取 消</el-button>
                <el-button type="primary" :disabled="isSaving" @click="confirmDelete">删 除</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getProjectQuestionnaires, deleteQuestionnaire } from '@/api/QuestionnaireService'

  export default {
    name: 'Questionnaire',
    data() {
      const projectId = this.$route.params.projectId
      return {
        loading: true,
        predicate: 'reportName',
        order: 'descending',
        sortPropMap: {
          reportName: 'report.title',
          lastModifiedDate: 'questionnaire.lastModifiedDate'
        },
        projectId: projectId,
        questionnaires: [],
        selectedQuestionnaire: null,
        total: 0,
        pageSize: 10, // 单页数据量
        currentPage: 1, // 默认开始页面
        deleteDialogVisible: false,
        baseApi: process.env.BASE_API,
        isSaving: false
      }
    },
    created() {
      this.getQuestionnaires()
    },
    methods: {
      sort() {
        return (this.predicate && this.order) ? this.sortPropMap[this.predicate] + ',' + (this.order === 'ascending' ? 'asc' : 'desc') : null
      },
      changeOrder(sort) {
        this.predicate = sort.prop
        this.order = sort.order
        this.getQuestionnaires()
      },
      currentChange: function(currentPage) {
        this.currentPage = currentPage
        this.getQuestionnaires()
      },
      getQuestionnaires() {
        this.loading = true
        getProjectQuestionnaires(this.projectId, {
          page: this.currentPage - 1,
          size: this.pageSize,
          sort: this.sort()
        }).then(response => {
          this.loading = false
          this.questionnaires = response.data
          this.total = Number(response.headers['x-total-count'])
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
      newInvestigation(questionnaireId) {
        this.$router.push({
          path: `/project/${this.projectId}/questionnaire/${questionnaireId}/investigation-input`
        })
      },
      investigation(questionnaireId) {
        this.$router.push({
          path: `/project/${this.projectId}/questionnaire/${questionnaireId}/investigation`
        })
      },
      alert(questionnaireId) {
        this.$router.push({
          path: `/project/${this.projectId}/questionnaire/${questionnaireId}/alert`
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
        this.isSaving = true
        deleteQuestionnaire(this.selectedQuestionnaire.id).then((res) => {
          this.isSaving = false
          this.closeDialog()
          this.loading = true
          this.getQuestionnaires()
        }, () => {
          this.isSaving = false
        })
      }
    }
  }
</script>

<style scoped>

</style>
