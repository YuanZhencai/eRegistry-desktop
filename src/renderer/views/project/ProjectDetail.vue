<template>
	<div class="project-detail">
		<el-container style="height: 100%">
			<el-aside class="sidebar" :class="{ 'aside-collapse': isCollapse }">
				<div v-if="isCollapse" class="sidebar-fold" @click="isCollapse = !isCollapse"
					 style="padding-left: 20px">
					<i class="fa fa-navicon"></i>
				</div>
				<div v-if="!isCollapse" class="sidebar-fold" @click="isCollapse = !isCollapse"
					 style="text-align: center">
					<i class="fa fa-navicon icon-fold"></i>
				</div>
				<el-menu :default-active="currentActive"
						 :active="currentActive"
						 :collapse="isCollapse"
						 :collapse-transition="false">
					<el-menu-item index="home"
								  @click="selectMenu('home')">
						<i class="fa fa-home"></i>
						<span slot="title" class="d-none d-md-inline">项目概览</span>
					</el-menu-item>
					<el-menu-item index="patient"
								  @click="selectMenu('patient')">
						<i class="fa fa-address-book-o"></i>
						<span slot="title" class="d-none d-md-inline">患者病例</span>
					</el-menu-item>
					<el-menu-item index="questionnaire"
								  @click="selectMenu('questionnaire')">
						<i class="fa fa-pencil-square-o"></i>
						<span slot="title" class="d-none d-md-inline">患者调查</span>
					</el-menu-item>
					<el-menu-item index="member"
								  v-if="$hasAnyAuthority(['PROJECT_ADMIN_' + projectId, 'PROJECT_MASTER_' + projectId])"
								  @click="selectMenu('member')">
						<i class="fa fa-users"></i>
						<span slot="title" class="d-none d-md-inline">项目成员</span>
					</el-menu-item>
					<el-menu-item index="center"
								  v-if="$hasAnyAuthority(['PROJECT_ADMIN_' + projectId, 'PROJECT_MASTER_' + projectId])"
								  @click="selectMenu('center')">
						<i class="fa fa-hospital-o"></i>
						<span slot="title" class="d-none d-md-inline">项目中心</span>
					</el-menu-item>
					<el-menu-item index="plan"
								  v-if="$hasAnyAuthority(['PROJECT_ADMIN_' + projectId, 'PROJECT_MASTER_' + projectId, 'PROJECT_PATIENT_' + projectId])"
								  @click="selectMenu('plan')">
						<i class="fa fa-medkit"></i>
						<span slot="title" class="d-none d-md-inline">随访计划</span>
					</el-menu-item>
					<el-menu-item index="calendar"
								  @click="selectMenu('calendar')">
						<i class="fa fa-calendar"></i>
						<span slot="title" class="d-none d-md-inline">随访日历</span>
					</el-menu-item>
					<el-menu-item index="log" v-if="$hasAnyAuthority(['PROJECT_ADMIN_' + projectId])"
								  @click="selectMenu('log')">
						<i class="fa fa-file-text"></i>
						<span slot="title" class="d-none d-md-inline">日志记录</span>
					</el-menu-item>
					<el-menu-item index="meeting" v-if="(project && project.videoEnabled) && !isWeb"
								  @click="selectMenu('meeting')">
						<i class="fa fa-video-camera"></i>
						<span slot="title" class="d-none d-md-inline">视频会议</span>
					</el-menu-item>
				</el-menu>
			</el-aside>
			<el-main class="main-wrapper">
				<router-view></router-view>
			</el-main>
		</el-container>
	</div>
</template>

<script>
	import { getProject } from '../../api/ProjectService'

	export default {
	  name: 'ProjectDetail',
	  data() {
	    const projectId = this.$route.params.projectId
	    const routerName = this.$route.path.split('/').reverse()[0]
	    return {
	      projectId: projectId,
	      isCollapse: false,
	      currentActive: routerName,
	      project: null,
	      isWeb: process.env.IS_WEB
	    }
	  },
	  created() {
	    this.findProject()
	  },
	  methods: {
	    selectMenu(menu) {
	      this.currentActive = menu
	      this.$router.push({
	        path: `/project/${this.projectId}/${menu}`
	      })
	    },
	    findProject() {
	      getProject(this.projectId).then((res) => {
	        this.project = res.data
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
.project-detail{
  height: 100%;
}
.sidebar {
  position: fixed;
  top: 50px;
  left: 0;
  width: 115px !important;
  z-index: 9;
  background-color: white;
}
.sidebar.aside-collapse {
  width: 64px !important;
}
.sidebar-fold {
  border-right: 1px solid #e6e6e6;
  padding: 5px 0;
  cursor: pointer;
}
.sidebar-fold .icon-fold {
  transform: rotate(90deg);
}
.main-wrapper {
  width: 100%;
  margin-left: 115px;
}
.aside-collapse + .main-wrapper {
  margin-left: 64px;
}
</style>
