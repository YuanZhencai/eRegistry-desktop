<template>
  <div class="col-flex h100" style="min-width: 1250px;">
    <el-row type="flex" class="row-bg" justify="space-between">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="float-left row-flex">
            <div class="avatar" style="margin-right: 15px;">
              <user-avatar :size="50" :username="name"></user-avatar>
            </div>
            <div class="desc">
              <p><small>当前登录用户</small></p>
              <div class="desc-title fa-lg" v-if="name"><strong>{{name}}</strong></div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light" style="margin-top: 12px;font-size: 20px">
          <strong v-if="this.project">{{this.project.name}}</strong>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="float-right row-flex" v-if="statistics && statistics.total && statistics.yesterday">
            <div>
              <p class="no-margin-bottom"><small>患者数</small></p>
              <p><span class="fa-2x">{{statistics.total.patientCount}}</span></p>
            </div>
            <el-divider direction="vertical" class="height-divider"></el-divider>
            <div>
              <p class="no-margin-bottom"><small>昨日新增病例</small></p>
              <p><span class="fa-2x">{{statistics.yesterday.patientCaseCount}}<span> / {{statistics.total.patientCaseCount}}</span></span></p>
            </div>
            <el-divider direction="vertical" class="height-divider"></el-divider>
            <div>
              <p class="no-margin-bottom"><small>昨日新增随访</small></p>
              <p><span class="fa-2x">{{statistics.yesterday.followCount}}<span> / {{statistics.total.followCount}}</span></span></p>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-divider class="no-flex no-margin-top"></el-divider>
    <div class="flex-grow" style="position: relative;">
      <div class="position-ab">
        <el-row class="h100">
          <el-col :span="15" class="h100">
            <el-row :gutter="8" class="h50">
              <el-card shadow="hover" class="h100"
                       :style="{'min-height': '278px'}"
                       :body-style="{ height: 'calc(100% - 45px)' }">
                <div slot="header" class="clearfix">
                  <span>登记数据</span>
                </div>
                <div class="card-body h100">
                  <div>
                    <el-form ref="form"
                             :inline="true"
                             size="mini">
                      <el-form-item>
                        <el-radio-group v-model="range" size="mini" @change="changeRange">
                          <el-radio-button label="week">周</el-radio-button>
                          <el-radio-button label="month">月</el-radio-button>
                          <el-radio-button label="year">年</el-radio-button>
                        </el-radio-group>
                      </el-form-item>
                      <el-form-item>
                        <el-date-picker type="date"
                                        v-model="dateRange"
                                        :type="rangeMap[range].type"
                                        range-separator="至"
                                        :start-placeholder="rangeMap[range].start"
                                        :end-placeholder="rangeMap[range].end"
                                        :clearable="false"
                                        @change="changeDateRange"
                                        style="width: 100%;">
                        </el-date-picker>
                      </el-form-item>
                      <el-form-item>
                        <el-select v-model="centerId" size="mini" @change="patient">
                          <el-option :label="'全部'" :value="0"></el-option>
                          <el-option v-for="center in centers" :key="center.id"
                                     :label="center.name" :value="center.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-form>
                  </div>
                  <div class="clearfix"></div>
                  <div class="chart-container" :style="{height: 'calc(100% - 33px)' }" v-if="patientOption">
                    <v-chart :options="patientOption" :theme="'walden'" autoresize style="width: 100%; height: 100%;"></v-chart>
                  </div>
                </div>
              </el-card>
              <el-card shadow="hover" class="h50"
                       :style="{'min-height': '250px'}"
                       :body-style="{ height: 'calc(100% - 28px)' }">
                <div slot="header" class="clearfix">
                  <span>随访数据</span>
                </div>
                <div class="chart-container h100" v-if="planOption">
                  <v-chart :options="planOption" :theme="'walden'" autoresize style="width: 100%; height: 100%;"></v-chart>
                </div>
              </el-card>
            </el-row>
          </el-col>
          <el-col :span="8" :offset="1">
            <el-card class="box-card panel-group">
              <div slot="header" class="clearfix" style="margin-top: 10px;">
                <span slot="label">告警<el-badge :value="topEvents.count" class="item"></el-badge></span>
              </div>
              <el-table
                :data="topEvents.events"
                :show-header="false"
                stripe
                style="width: 100%">
                <el-table-column>
                  <template slot-scope="scope">
                    <el-row>
                      <el-col :span="12"><div class=" " style="font-size: 14px;font-weight: 500;">{{scope.row.title}}</div></el-col>
                      <el-col :span="12">
						  <div class=" " style="text-align: right;">
							  <el-button type="text" @click="viewEvent(scope.row)">查看</el-button>
						  </div>
					  </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
						  <div class=" " style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden;">
							  <span style="margin-right: 5px">{{scope.row.question}}</span><span :class="scope.row.type">{{scope.row.content}}</span>
						  </div>
					  </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12"><div class=" " style="color: #6c757d;margin-top: 5px;">{{scope.row.patientName ? scope.row.patientName: scope.row.submitter}}</div></el-col>
                      <el-col :span="12"><div class=" " style="text-align: right">{{scope.row.date | formatDate('YYYY-MM-DD HH:mm')}}</div></el-col>
                    </el-row>
                  </template>
                </el-table-column>
              </el-table>
              <div class="text-right">
                <el-button type="text" size="mini">
                  <router-link :to="{ path: `/project/${projectId}/event`, params: {projectId} }">更多...</router-link>
                </el-button>
              </div>
            </el-card>
            <el-card shadow="hover" class="panel-group">
              <div slot="header" class="clearfix">
                <span>项目成员</span>
              </div>
              <div class="card-body">
                <el-row :gutter="10">
                  <el-col :span="8" v-for="member in showMembers" :key="member.id">
                    <user-avatar :username="member.username" :size="30"></user-avatar>
                    <span>
                  {{member.username}}
                  <template v-if="member.task">
                    (<span>{{taskType[member.task]}}</span>)
                  </template>
                </span>
                  </el-col>
                </el-row>
                <div class="text-right" v-if="members.length > 6">
                  <el-button type="text" size="mini">
                    <router-link :to="{ path: `/project/${projectId}/member`, params: {projectId}}">更多...</router-link>
                  </el-button>
                </div>
              </div>
            </el-card>
            <el-card shadow="hover" class="panel-group" :body-style="{ padding: '10px'}">
              <div slot="header" class="clearfix">
                <span>快速开始 / 便捷导航</span>
              </div>
				<div class="card-body">
					<template v-if="$hasAnyAuthority(['PROJECT_ADMIN_' + projectId, 'PROJECT_MASTER_' + projectId])">
						<el-button type="text" @click="setProject">项目设置</el-button>
						<el-button type="text">
							<router-link :to="{ path: `/project/${projectId}/attachment-setting`}">病例附件管理</router-link>
						</el-button>
						<el-button type="text">
							<router-link :to="{ path: `/project/${projectId}/informed-consent` }">知情同意书</router-link>
						</el-button>
						<el-button type="text">
							<router-link :to="{ path: `/project/${projectId}/article` }">文章管理</router-link>
						</el-button>
					</template>

					<el-button type="text"
							   v-if="$hasAnyAuthority(['PROJECT_ADMIN_' + projectId, 'PROJECT_PATIENT_' + projectId])">
						<router-link :to="{ path: `/project/${projectId}/report`}">CRF</router-link>
					</el-button>

				</div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
    <project-dialog-component ref="project-dialog"></project-dialog-component>
  </div>
</template>

<script>
  import ECharts from 'vue-echarts'
  import 'echarts'
  import { mapGetters } from 'vuex'
  import { getAllCenters } from '@/api/CenterService'
  import { getProjectMembers } from '@/api/MemberService'
  import { getProjectStatistics, getDateChart, getPlanChart } from '@/api/StatisticsService'
  import UserAvatar from '../../components/avatar/userAvatar'
  import ProjectDialogComponent from './ProjectDialogComponent'
  import { getProject } from '@/api/ProjectService'
  import { getTopAlertEvents } from '../../api/AlertService'
  import moment from 'moment'

  export default {
    name: 'ProjectHome',
    components: { UserAvatar,
      ProjectDialogComponent,
      'v-chart': ECharts
    },
    computed: {
      ...mapGetters([
        'name',
        'roles',
        'avatar'
      ]),
      showMembers: function() {
        return this.members.slice(0, 6)
      },
      showChanges: function() {
        return this.changes.slice(0, 5)
      }
    },
    data() {
      const projectId = this.$route.params.projectId
      return {
        projectId,
        centerId: 0,
        range: 'week',
        rangeMap: {
          'week': {
            'type': 'daterange',
            'start': '开始日期',
            'end': '结束日期'
          },
          'month': {
            'type': 'daterange',
            'start': '开始日期',
            'end': '结束日期'
          },
          'year': {
            'type': 'monthrange',
            'start': '开始月份',
            'end': '结束月份'
          }
        },
        dateRange: [],
        statistics: {},
        centers: [],
        members: [],
        changes: [],
        patientOption: null,
        planOption: null,
        taskType: {
          null: '',
          PATIENT: '录入',
          DOCTOR: '医生',
          FOLLOWER: '随访专员',
          MASTER: '管理',
          AUDIT: '审核',
          VIEW: '查看'
        },
        project: null,
        activeName: 'first',
        topEvents: {
          events: [],
          count: 0
        },
        beginDate: null,
        endDate: null
      }
    },
    created() {
      this.loadAll()
    },
    methods: {
      loadAll() {
        getProject(this.projectId).then(res => {
          this.project = res.data
          this.changeRange()
        })
        this.findEvents()
        this.findCenters()
        this.findProjectStatistics()
        this.plan()
        this.findMembers()
        this.getProject()
      },
      findEvents() {
        getTopAlertEvents(this.projectId).then((res) => {
          this.topEvents = res.data
        })
      },
      findCenters() {
        getAllCenters({ 'EQ_center.projectId': this.projectId }).then((res) => {
          this.centers = res.data
        })
      },
      findMembers() {
        getProjectMembers(this.projectId, { page: 0, size: 7 }).then((res) => {
          this.members = res.data
        })
      },
      findProjectStatistics() {
        getProjectStatistics(this.projectId).then((res) => {
          this.statistics = res.data
        })
      },
      changeRange() {
        if (this.project && this.project.endDate) {
          this.endDate = moment(this.project.endDate)
        } else {
          this.endDate = moment(new Date())
        }
        if (this.range === 'week') {
          this.beginDate = moment(this.endDate).subtract(7, 'days')
        } else if (this.range === 'month') {
          this.beginDate = moment(this.endDate).subtract(1, 'months')
        } else if (this.range === 'year') {
          this.beginDate = moment(this.endDate).subtract(1, 'years')
        }
        this.dateRange = [this.beginDate, this.endDate]
        this.patient()
      },
      changeDateRange() {
        this.beginDate = moment(this.dateRange[0])
        this.endDate = moment(this.dateRange[1])
        this.patient()
      },
      patient() {
        const req = {
          range: this.range,
          beginDate: this.beginDate.format('YYYY-MM-DD'),
          endDate: this.endDate.format('YYYY-MM-DD'),
          centerId: null
        }
        if (this.centerId !== 0) {
          req.centerId = this.centerId
        }
        getDateChart(this.projectId, req).then((res) => {
          this.patientOption = res.data
        })
      },
      plan() {
        getPlanChart(this.projectId).then(res => {
          this.planOption = res.data
        })
      },
      setProject() {
        this.$refs['project-dialog'].show(this.projectId).then(() => {
          this.loadAll()
        }, () => {})
      },
      getProject() {

      },
      viewEvent(event) {
        this.$router.push({
          path: `/project/${this.projectId}/event/${event.id}`
        })
      }
    }
  }
</script>

<style scoped>
  .height-divider {
    height: 3em;
    margin: 0 1.5em;
  }
  .divider-margin{
    margin: 10px 0;
  }
  .box-card .el-card__body{
    padding: 20px 0px;
  }
  .card-body{
    font-size: 12px;
  }
  .position-ab {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
  }

</style>
