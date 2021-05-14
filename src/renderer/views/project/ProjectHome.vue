<template>
  <div class="col-flex h100">
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
          <strong>{{this.projectName}}</strong>
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
            <el-row :gutter="8" class="h100">
              <el-card shadow="hover" class="h50"
                       :style="{'min-height': '278px'}"
                       :body-style="{ height: 'calc(100% - 45px)' }">
                <div slot="header" class="clearfix">
                  <span>登记数据</span>
                  <el-select v-model="centerId" size="mini" style="float: right; padding: 3px 0" @change="patient">
                    <el-option :label="'全部'" :value="0"></el-option>
                    <el-option v-for="center in centers" :key="center.id"
                               :label="center.name" :value="center.id">
                    </el-option>
                  </el-select>
                </div>
                <div class="card-body h100">
                  <el-radio-group class="float-right" v-model="range" size="mini" @change="patient">
                    <el-radio-button label="week">周</el-radio-button>
                    <el-radio-button label="month">月</el-radio-button>
                    <el-radio-button label="year">年</el-radio-button>
                  </el-radio-group>
                  <div class="clearfix"></div>
                  <div class="chart-container" :style="{height: 'calc(100% - 33px)' }" v-if="patientOption">
                    <v-chart :options="patientOption" autoresize style="width: 100%; height: 100%;"></v-chart>
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
                  <v-chart :options="planOption" autoresize style="width: 100%; height: 100%;"></v-chart>
                </div>
              </el-card>
            </el-row>
          </el-col>
          <el-col :span="8" :offset="1">
            <el-card class="box-card panel-group">
              <div slot="header" class="clearfix" style="margin-top: 10px;">
                <span slot="label">告警<el-badge :value="7" class="item"></el-badge></span>
              </div>
              <el-table
                :data="tableData"
                :show-header="false"
                stripe
                style="width: 100%">
                <el-table-column>
                  <template slot-scope="scope">
                    <el-row>
                      <el-col :span="12"><div class=" " style="font-size: 18px;font-weight: 500;">不良反应</div></el-col>
                      <el-col :span="12"><div class=" " style="text-align: right;"><el-button type="text">查看</el-button></div></el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24"><div class=" " style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden;">食欲下降很严重、食欲下降很严重、食欲下降很严重、食欲下降很严重、食欲下降很严重、食欲下降很严重、食欲下降很严重、食欲下降很严重、食欲下降很严重、食欲下降很严重、食欲下降很严重、食欲下降很严重、</div></el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12"><div class=" " style="color: #6c757d;margin-top: 5px;">刘忻好</div></el-col>
                      <el-col :span="12"><div class=" " style="text-align: right">2021-05-14</div></el-col>
                    </el-row>
                  </template>
                </el-table-column>
              </el-table>
              <div class="text-right" v-if="changes.length > 5">
                <el-button type="text" size="mini">
                  <router-link :to="{ path: `/project/${projectId}/log`, params: {projectId} }">更多...</router-link>
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
            <el-card shadow="hover" class="panel-group" :body-style="{ padding: '10px'}">
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
            <el-card shadow="hover" :body-style="{ padding: '10px'}">
              <div slot="header" class="clearfix">
                <span>动态</span>
              </div>
              <div class="card-body">
                <div class="text-center" v-if="changes.length === 0">暂无数据</div>
                <div v-for="(change, index) in showChanges" :key="index">
                  <div class="row-flex">
                    <user-avatar :username="change.author" :size="30"></user-avatar>
                    <div style="margin-left: 10px;">
                      <p class="no-margin-bottom">{{change.author}} {{change.action}}</p>
                      <p class="no-margin-bottom">{{change.commitDate | formatDate('YYYY-MM-DD hh:mm:ss')}}</p>
                    </div>
                  </div>
                  <el-divider class="divider-margin"></el-divider>
                </div>
                <div class="text-right" v-if="changes.length > 5">
                  <el-button type="text" size="mini">
                    <router-link :to="{ path: `/project/${projectId}/log`, params: {projectId} }">更多...</router-link>
                  </el-button>
                </div>
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
  import { getChanges } from '@/api/ProjectService'
  import { getProjectStatistics, getDateChart, getPlanChart } from '@/api/StatisticsService'
  import UserAvatar from '../../components/avatar/userAvatar'
  import ProjectDialogComponent from './ProjectDialogComponent'
  import { getProject } from '@/api/ProjectService'

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
        projectName: '',
        activeName: 'first',
        tableData: [{
          questionnaire: '不良反应',
          name: '示长星',
          bad: '食欲下降很严重',
          date: '2021-05-10'
        }, {
          questionnaire: '不良反应',
          name: '虢昆鹏',
          bad: '胃灼热严重',
          date: '2021-05-10'
        }, {
          questionnaire: '卵巢癌患者随访项目不良反应',
          name: '刘星',
          bad: '食欲下降很严重',
          date: '2021-05-10'
        }]
      }
    },
    created() {
      this.loadAll()
    },
    methods: {
      handleClick(tab, event) {
      },
      view1() {
        this.$router.push({
          path: `/project/20058/questionnaire/51/investigation/186`
        })
      },
      view2() {
        this.$router.push({
          path: `/project/20058/questionnaire/51/investigation/187`
        })
      },
      loadAll() {
        this.findCenters()
        this.findProjectStatistics()
        this.patient()
        this.plan()
        this.findMembers()
        this.findChanges()
        this.getProjects()
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
        this.$refs['project-dialog'].show(this.projectId).then(() => {
          this.loadAll()
        }, () => {})
      },
      getProjects() {
        getProject(this.projectId).then(res => {
          this.projectName = res.data.name
          console.log(this.projectName, '2')
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
