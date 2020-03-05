<template>
  <div class="dashboard-container">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>进行中的项目</span>
        <el-button style="float: right; padding: 3px 0" type="text">
          <router-link :to="{path: '/project'}">全部项目</router-link>
        </el-button>
      </div>
      <el-row :gutter="20" v-loading="loading">
        <el-col :span="8" v-for="project in projects" :key="project.id">
          <el-card  class="text item">
            <div class="card-header">
              <router-link :to="{path: `/project/${project.id}/home`}">{{project.name}}</router-link>
            </div>
            <p class="project-intro">{{project.introduction}}</p>
            <div class="project-info">
              <div class="float-left">
                <div class="row-flex">
                  <el-avatar icon="el-icon-user-solid" size="small"></el-avatar>
                  <span style="margin-left: 5px;">{{project.chargedBy}}</span>
                </div>
              </div>
              <div class="float-right">{{project.lastModifiedDate | formatDate('YYYY-MM-DD')}}</div>
              <div class="clearfix"></div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getMineProjects } from '@/api/ProjectResource'

export default {
  name: 'dashboard',
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  data() {
    return {
      projects: null,
      loading: true
    }
  },
  created() {
    this.getProjects()
  },
  methods: {
    getProjects() {
      getMineProjects({ all: false }).then(res => {
        this.projects = res.data
        this.loading = false
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.card-header{
  margin-bottom: 10px;
}
.project-intro{
  font-size: 12px;
  text-align: left;
  height: 40px;
  overflow: hidden;
}
</style>
