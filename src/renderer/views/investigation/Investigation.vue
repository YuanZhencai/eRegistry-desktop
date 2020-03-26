<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline" size="mini">
      <el-form-item>
        <el-input v-model="content" placeholder="搜索内容" suffix-icon="el-icon-search" @change="transition"></el-input>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="开始时间" v-model="begin" @change="transition"
                          style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-date-picker type="date" placeholder="结束时间" v-model="end" @change="transition"
                          style="width: 100%;"></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item v-if="$hasAnyAuthority(['PROJECT_ADMIN_' + projectId])">
        <el-button v-if="report && report.title"
                   v-download="{name: `${report.title}.xls`, url: `/api/projects/${projectId}/questionnaire/${questionnaireId}/data`}"
                   type="primary"
                   size="mini">
          <span class="fa fa-download"></span>
          <span class="d-none d-md-inline">导出</span>
        </el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading"
            :data="investigations"
            stripe
            @sort-change="changeOrder"
            style="width: 100%">
      <el-table-column
              prop="id"
              sortable="custom"
              label="ID">
      </el-table-column>
      <el-table-column v-for="(type, key, index) in keys" :label="key" :key="index">
        <template slot-scope="scope" v-if="type !== 'file'">
          {{JSON.parse(scope.row.content)[key] | ellipsis }}
        </template>
      </el-table-column>
      <el-table-column
              sortable="custom"
              label="创建时间"
              width="180">
        <template slot-scope="scope">
          {{scope.row.createdDate | formatDate('YYYY-MM-DD HH:mm:ss')}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="view(scope.row)">
              查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
            @current-change="loadPage"
            :current-page="page"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="size"
            layout="total, prev, pager, next, jumper"
            :total="totalItems">
    </el-pagination>
  </div>
</template>

<script>
  import * as SurveyVue from 'survey-vue'
  import { getInvestigations } from '../../api/InvestigationService'
  import { getQuestionnaireReport } from '../../api/QuestionnaireService'

  export default {
    name: 'Investigation',
    data() {
      return {
        projectId: this.$route.params.projectId,
        investigations: [],
        questions: [],
        page: 1,
        previousPage: 1,
        size: 10,
        predicate: 'id',
        order: 'ascending',
        totalItems: null,
        queryCount: null,
        filter: {},
        questionnaireId: this.$route.params.questionnaireId,
        begin: null,
        end: null,
        content: null,
        loading: true,
        report: null,
        keys: {}
      }
    },
    mounted() {
      this.findQuestionnaireReport()
    },
    methods: {
      sort() {
        return (this.predicate && this.order) ? this.predicate + ',' + (this.order === 'ascending' ? 'asc' : 'desc') : null
      },
      loadAll() {
        const that = this
        this.loading = true
        this.investigations = []
        const sort = this.sort()
        getInvestigations(Object.assign({
          page: this.page - 1,
          size: this.size,
          sort
        }, this.query())
        ).then((res) => {
          that.investigations = res.data
          that.totalItems = Number(res.headers['x-total-count'])
          that.queryCount = that.totalItems
          that.loading = false
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
        this.predicate = sort.prop
        this.order = sort.order
        this.transition()
      },
      query() {
        this.filter = {
          'EQ_investigation.questionnaireId': this.questionnaireId,
          'GT_investigation.createdDate': this.begin ? this.begin.toISOString() : null,
          'LT_investigation.createdDate': this.end ? this.end.toISOString() : null,
          'LIKE_investigation.content': this.content ? `%${this.content}%` : null
        }
        return this.filter
      },
      view(investigation) {
        this.$router.push({
          path: `/project/${this.projectId}/questionnaire/${this.questionnaireId}/investigation/${investigation.id}`
        })
      },
      findQuestionnaireReport() {
        const that = this
        getQuestionnaireReport(this.questionnaireId).then((res) => {
          that.report = res.data
          that.reportKeys()
          that.loadAll()
        })
      },
      reportKeys() {
        this.keys = {}
        const surveyModel = new SurveyVue.Model(this.report.survey)
        this.questions = surveyModel.getAllQuestions()
        const count = this.questions.length > 5 ? 5 : this.questions.length
        for (let i = 0; i < count; i++) {
          this.$set(this.keys, this.questions[i].name, this.questions[i].getType())
        }
      }
    }
  }
</script>

<style scoped>
    .line {
        text-align: center;
    }
</style>
