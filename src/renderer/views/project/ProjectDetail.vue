<template>
  <div class="app-container">
    <el-container style="height: 100%">
      <el-aside width="135px" style="background-color: rgb(238, 241, 246)">
        <el-menu :default-active="currentActive" :active="currentActive">
          <el-menu-item index="home" @click="selectMenu('home')">
            <template slot="title">
              <i class="el-icon-s-home"></i>
              <span slot="title">项目概览</span>
            </template>
          </el-menu-item>
          <el-menu-item index="patient" @click="selectMenu('patient')">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span slot="title">患者病例</span>
            </template>
          </el-menu-item>
          <el-menu-item index="questionnaire" @click="selectMenu('questionnaire')">
            <template slot="title">
              <i class="el-icon-edit-outline"></i>
              <span slot="title">患者调查</span>
            </template>
          </el-menu-item>
          <el-menu-item index="member" @click="selectMenu('member')">
            <template slot="title">
              <i class="el-icon-s-custom"></i>
              <span slot="title">项目成员</span>
            </template>
          </el-menu-item>
          <el-menu-item index="center" @click="selectMenu('center')">
            <template slot="title">
              <i class="el-icon-office-building"></i>
              <span slot="title">项目中心</span>
            </template>
          </el-menu-item>
          <el-menu-item>
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span slot="title">随访计划</span>
            </template>
          </el-menu-item>
          <el-menu-item>
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span slot="title">随访日历</span>
            </template>
          </el-menu-item>
          <el-menu-item>
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span slot="title">日志记录</span>
            </template>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-main style="padding-top: 0; padding-right: 0">
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  export default {
    name: 'ProjectDetail',
    data() {
      const projectId = this.$route.params.projectId
      const routerName = this.$route.path.split('/').reverse()[0]
      return {
        projectId: projectId,
        isCollapse: true,
        currentActive: routerName
      }
    },
    created() {
    },
    methods: {
      selectMenu(menu) {
        this.currentActive = menu
        this.$router.push({
          path: `/project/${this.projectId}/${menu}`
        })
      }
    }
  }
</script>

<style scoped>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-menu-item.is-active {
    background-color: #ecf5ff;
  }
</style>
