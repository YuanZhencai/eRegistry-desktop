<template>
  <div class="">
    <el-row class="">
      <div class="float-left row-flex">
        <div class="avatar" style="margin-right: 15px;">
          <el-avatar :size="50" :src="avatar"></el-avatar>
        </div>
        <div class="desc">
          <p><small>当前登录用户</small></p>
          <div class="desc-title fa-lg" v-if="name"><strong>{{name}}</strong></div>
        </div>
      </div>
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
    </el-row>
    <el-divider class="no-margin-top"></el-divider>
    <el-row>
      <el-col :span="15">
        <el-row :gutter="8">
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <span>登记数据</span>
              <el-select v-model="centerId" size="mini" style="float: right; padding: 3px 0" @change="patient">
                <el-option :label="'全部'" :value="0"></el-option>
                <el-option v-for="center in centers" :key="center.id"
                           :label="center.name" :value="center.id">
                </el-option>
              </el-select>
            </div>
            <div class="card-body">
              <el-radio-group class="float-right" v-model="range" size="mini" @change="patient">
                <el-radio-button label="week">周</el-radio-button>
                <el-radio-button label="month">月</el-radio-button>
                <el-radio-button label="year">年</el-radio-button>
              </el-radio-group>
              <div class="clearfix"></div>
              <div class="chart-container" v-if="patientOption">
                <v-chart :options="patientOption" autoresize style="width: 100%"></v-chart>
              </div>
            </div>
          </el-card>
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <span>随访数据</span>
            </div>
            <div class="chart-container" v-if="planOption">
              <v-chart :options="planOption" autoresize style="width: 100%"></v-chart>
            </div>
          </el-card>
        </el-row>
      </el-col>
      <el-col :span="8" :offset="1">
        <el-card shadow="hover" class="panel-group">
          <div slot="header" class="clearfix">
            <span>快速开始 / 便捷导航</span>
          </div>
          <div class="card-body">
            <el-button type="text" @click="setProject"
                       v-if="$hasAnyAuthority(['PROJECT_ADMIN_' + projectId, 'PROJECT_MASTER_' + projectId])">项目设置</el-button>
            <el-button type="text"
                       v-if="$hasAnyAuthority(['PROJECT_ADMIN_' + projectId, 'PROJECT_PATIENT_' + projectId])">
              <router-link :to="{ path: `/project/${projectId}/report`, params: {projectId} }">CRF</router-link>
            </el-button>
          </div>
        </el-card>
        <el-card shadow="hover" class="panel-group">
          <div slot="header" class="clearfix">
            <span>项目成员</span>
          </div>
          <div class="card-body">
            <el-row :gutter="48">
              <el-col :span="12" v-for="(member, index) in members" :key="member.id" v-if="index < 6">
                <user-avatar :username="member.username" :size="40"></user-avatar>
                <span>
                  {{member.username}}
                  <template v-if="member.task">
                    (<span>{{TaskType[member.task]}}</span>)
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
        <el-card shadow="hover" :body-style="{ padding: '20px' }">
          <div slot="header" class="clearfix">
            <span>动态</span>
          </div>
          <div class="card-body">
            <div v-for="(change, index) in changes" :key="index" v-if="index < 5">
              <div class="row-flex">
                <user-avatar :username="change.author" :size="30"></user-avatar>
                <div style="margin-left: 10px;">
                  <p >{{change.author}} {{change.action}}</p>
                  <p class="no-margin-bottom">{{change.commitDate | formatDate('YYYY-MM-DD hh:mm:ss')}}</p>
                </div>
              </div>
              <el-divider class="divider-margin"></el-divider>
            </div>
            <div class="text-right" v-if="changes.length > 5">
              <el-button type="text" size="mini">更多...</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <project-dialog-component ref="project-dialog" :project-id="Number(projectId)"></project-dialog-component>
  </div>
</template>

<script>
  import ECharts from 'vue-echarts'
  import 'echarts'
  import { mapGetters } from 'vuex'
  import { getAllCenters } from '@/api/CenterService'
  import { getProjectMembers } from '@/api/MemberService'
  import { getChanges } from '@/api/ProjectService'
  import { getProjectStatistics, getDateChart, getPlanChart } from '@/api/StatisticsService'
  import UserAvatar from '../../components/avatar/userAvatar'
  import ProjectDialogComponent from './ProjectDialogComponent'

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
      ])
    },
    data() {
      const projectId = this.$route.params.projectId
      return {
        projectId,
        centerId: 0,
        range: 'week',
        statistics: {},
        centers: [],
        members: [],
        changes: [],
        patientOption: null,
        planOption: null,
        TaskType: {
          null: '',
          PATIENT: '录入',
          MASTER: '管理',
          AUDIT: '审核',
          VIEW: '查看',
          ADMIN: '负责人'
        },
        projectDialogVisible: false
      }
    },
    created() {
      this.findCenters()
      this.findProjectStatistics()
      this.patient()
      this.plan()
      this.findMembers()
      this.findChanges()
    },
    methods: {
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
      findChanges() {
        getChanges(this.projectId, { page: 0, size: 6 }).then((res) => {
          this.changes = res.data
        })
      },
      findProjectStatistics() {
        getProjectStatistics(this.projectId).then((res) => {
          this.statistics = res.data
        })
      },
      patient() {
        const req = {
          range: this.range,
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
        this.projectDialogVisible = true
        this.$refs['project-dialog'].show()
      },
      closeDialog(val) {
        this.projectDialogVisible = false
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
</style>
