<template>
	<div class="grid-content bg-purple-dark" :class="this.type !== 'questionnaire' ? ' dashboard-editor-container': ''">
		<span style="border: 2px solid #cecbcb"></span>
		<span style="margin-left: 5px;">调查结果</span>
		<el-form :inline="true" class="demo-form-inline" style="margin-top: 10px;">
			<el-form-item>
				<el-input v-model="content" placeholder="搜索内容" suffix-icon="el-icon-search" :disabled="!questionnaireId"
						  @change="transition"></el-input>
			</el-form-item>
			<el-form-item label="创建时间">
				<el-col :span="11">
					<el-date-picker type="date" placeholder="开始时间" v-model="begin" @change="transition"
									:disabled="!questionnaireId"
									style="width: 100%;"></el-date-picker>
				</el-col>
				<el-col class="line" :span="2">-</el-col>
				<el-col :span="11">
					<el-date-picker type="date" placeholder="结束时间" v-model="end" @change="transition"
									:disabled="!questionnaireId"
									style="width: 100%;"></el-date-picker>
				</el-col>
			</el-form-item>
			<el-form-item v-if="$hasAnyAuthority(['PROJECT_ADMIN_' + projectId])">
				<el-button v-if="report && report.title"
						   v-download="{name: `${report.title}.zip`, url: `api/projects/${projectId}/questionnaire/${questionnaireId}/data`}"
						   type="primary"
						   size="mini">
					<span class="fa fa-download"></span>
					<span class="d-none d-md-inline">导出</span>
				</el-button>
			</el-form-item>
		</el-form>
		<el-row :gutter="40" class="panel-group" v-if="this.type !== 'questionnaire'">
			<el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
				<div class="card-panel" @click="toInvestigation">
					<div class="card-panel-icon-wrapper icon-people">
						<svg-icon icon-class="message" class-name="card-panel-icon"/>
					</div>
					<div class="card-panel-description">
						<div class="card-panel-text">
							总记录数
						</div>
						<count-to :start-val="0" :end-val="questionnaireSum.investigation" :duration="2600"
								  class="card-panel-num"/>
					</div>
				</div>
			</el-col>
			<el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
				<div class="card-panel" @click="toInvestigation">
					<div class="card-panel-icon-wrapper icon-message">
						<svg-icon icon-class="peoples" class-name="card-panel-icon"/>
					</div>
					<div class="card-panel-description">
						<div class="card-panel-text">
							填写人数
						</div>
						<count-to :start-val="0" :end-val="questionnaireSum.patient" :duration="3000"
								  class="card-panel-num"/>
					</div>
				</div>
			</el-col>
			<el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
				<div class="card-panel" @click="toEvents">
					<div class="card-panel-icon-wrapper icon-money">
						<svg-icon icon-class="alert" class-name="card-panel-icon"/>
					</div>
					<div class="card-panel-description">
						<div class="card-panel-text">
							中风险
						</div>
						<count-to :start-val="0" :end-val="questionnaireSum.warn" :duration="3200"
								  class="card-panel-num"/>
					</div>
				</div>
			</el-col>
			<el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
				<div class="card-panel" @click="toEvents">
					<div class="card-panel-icon-wrapper icon-shopping">
						<svg-icon icon-class="error" class-name="card-panel-icon"/>
					</div>
					<div class="card-panel-description">
						<div class="card-panel-text">
							高风险
						</div>
						<count-to :start-val="0" :end-val="questionnaireSum.error" :duration="3600"
								  class="card-panel-num"/>
					</div>
				</div>
			</el-col>
		</el-row>
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
			<el-table-column v-for="(key, index) in keys" :label="key" :key="index" :show-overflow-tooltip="true">
				<template slot-scope="scope">
					{{JSON.parse(scope.row.content)[key] | ellipsis }}
				</template>
			</el-table-column>
			<el-table-column label="患者" sortable="custom">
				<template slot-scope="scope">
					{{scope.row.patientName ? scope.row.patientName: '匿名'}}
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
				background
				@current-change="loadPage"
				:current-page="page"
				:page-size="size"
				layout="total, prev, pager, next, jumper"
				:total="totalItems" class="pagination">
		</el-pagination>
	</div>
</template>

<script>
	import * as SurveyVue from 'survey-vue'
	import { getInvestigations } from '../../api/InvestigationService'
	import { getQuestionnaireReport, getQuestionnaireSum } from '../../api/QuestionnaireService'
	import CountTo from 'vue-count-to'

	export default {
	  name: 'Investigation',
	  components: {
	    CountTo
	  },
	  props: ['projectId', 'questionnaireId', 'type'],
	  watch: {
	    questionnaireId: {
	      deep: true,
	      handler(newValue, oldValue) {
	        this.init()
	      }
	    }
	  },
	  data() {
	    return {
	      investigations: [],
	      questions: [],
	      page: 1,
	      previousPage: 1,
	      size: 10,
	      predicate: 'id',
	      order: 'ascending',
	      sortPropMap: {
	        id: 'investigation.id',
	        createdDate: 'investigation.createdDate',
	        patientName: 'patient.name'
	      },
	      totalItems: null,
	      queryCount: null,
	      filter: {},
	      begin: null,
	      end: null,
	      content: null,
	      loading: false,
	      report: null,
	      keys: [],
	      questionnaireSum: {
	        investigation: 0,
	        patient: 0,
	        warn: 0,
	        error: 0
	      }
	    }
	  },
	  mounted() {
	    this.init()
	  },
	  methods: {
	    init() {
	      if (this.type !== 'questionnaire') {
	        this.sumQuestionnaire()
	      }
	      this.findQuestionnaireReport()
	    },
	    sort() {
	      return (this.predicate && this.order) ? this.sortPropMap[this.predicate] + ',' + (this.order === 'ascending' ? 'asc' : 'desc') : null
	    },
	    loadAll() {
	      this.loading = true
	      this.investigations = []
	      const sort = this.sort()
	      getInvestigations(Object.assign({
	        page: this.page - 1,
	        size: this.size,
	        sort
	      }, this.query())
	      ).then((res) => {
	        this.investigations = res.data
	        this.totalItems = Number(res.headers['x-total-count'])
	        this.queryCount = this.totalItems
	        this.loading = false
	      })
	    },
	    transition() {
	      this.loadAll()
	    },
	    loadPage(page) {
	      if (page !== this.previousPage) {
	        this.previousPage = page
	        this.page = page
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
	      if (this.questionnaireId) {
	        this.report = null
	        getQuestionnaireReport(this.questionnaireId).then((res) => {
	          this.report = res.data
	          this.reportKeys()
	          this.loadAll()
	        })
	      }
	    },
	    reportKeys() {
	      this.keys = []
	      const excludes = ['file', 'imagepicker', 'signaturepad', 'panel', 'paneldynamic', 'html', 'matrix', 'matrixdropdown', 'matrixdynamic', 'multipletext', 'editor', 'tagbox']
	      const surveyModel = new SurveyVue.Model(this.report.survey)
	      this.questions = surveyModel.getAllQuestions()
	      let count = 0
	      for (let i = 0; i < this.questions.length; i++) {
	        const question = this.questions[i]
	        if (!excludes.includes(question.getType())) {
	          this.keys.push(question.name)
	        }
	        if (count >= 5) {
	          break
	        } else {
	          count++
	        }
	      }
	    },
	    sumQuestionnaire() {
	      if (this.questionnaireId) {
	        getQuestionnaireSum(this.questionnaireId).then(res => {
	          this.questionnaireSum = res.data
	        })
	      }
	    },
	    toInvestigation() {
	      this.$router.push({
	        path: `/project/${this.projectId}/questionnaire/${this.questionnaireId}/investigation-result`
	      })
	    },
	    toEvents() {
	      this.$router.push({
	        path: `/project/${this.projectId}/event`
	      })
	    }
	  }
	}
</script>

<style lang="scss" scoped>
	.line {
		text-align: center;
	}

	.dashboard-editor-container {
		padding: 32px;
		background-color: rgb(240, 242, 245);
		position: relative;

		.github-corner {
			position: absolute;
			top: 0px;
			border: 0;
			right: 0;
		}

		.chart-wrapper {
			background: #fff;
			padding: 16px 16px 0;
			margin-bottom: 32px;
		}
	}

	@media (max-width: 1024px) {
		.chart-wrapper {
			padding: 8px;
		}
	}

	.panel-group {
		margin-top: 18px;

		.card-panel-col {
			margin-bottom: 32px;
		}

		.card-panel {
			height: 108px;
			cursor: pointer;
			font-size: 12px;
			position: relative;
			overflow: hidden;
			color: #666;
			background: #fff;
			box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
			border-color: rgba(0, 0, 0, .05);

			&:hover {
				.card-panel-icon-wrapper {
					color: #fff;
				}

				.icon-people {
					background: #40c9c6;
				}

				.icon-message {
					background: #36a3f7;
				}

				.icon-money {
					background: #E6A23C;
				}

				.icon-shopping {
					background: #F56C6C
				}
			}

			.icon-people {
				color: #40c9c6;
			}

			.icon-message {
				color: #36a3f7;
			}

			.icon-money {
				color: #E6A23C;
			}

			.icon-shopping {
				color: #F56C6C
			}

			.card-panel-icon-wrapper {
				float: left;
				margin: 14px 0 0 14px;
				padding: 16px;
				transition: all 0.38s ease-out;
				border-radius: 6px;
			}

			.card-panel-icon {
				float: left;
				font-size: 48px;
			}

			.card-panel-description {
				float: right;
				font-weight: bold;
				margin: 26px;
				margin-left: 0px;

				.card-panel-text {
					line-height: 18px;
					color: rgba(0, 0, 0, 0.45);
					font-size: 16px;
					margin-bottom: 12px;
				}

				.card-panel-num {
					font-size: 20px;
				}
			}
		}
	}

	@media (max-width: 550px) {
		.card-panel-description {
			display: none;
		}

		.card-panel-icon-wrapper {
			float: none !important;
			width: 100%;
			height: 100%;
			margin: 0 !important;

			.svg-icon {
				display: block;
				margin: 14px auto !important;
				float: none !important;
			}
		}
	}
</style>
