import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: 'Example', icon: 'example' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: 'Table', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Tree', icon: 'tree' }
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },
  {
    path: '/report',
    component: Layout,
    name: 'Report',
    meta: {
      title: 'CRF', icon: 'el-icon-word'
    },
    children: [
      {
        path: '',
        name: 'ReportList',
        component: () => import('@/views/report/Report')
      },
      {
        path: 'new',
        name: 'ReportNew',
        component: () => import('@/views/report/ReportDetail')
      },
      {
        path: ':reportId',
        name: 'ReportDetail',
        component: () => import('@/views/report/ReportDetail')
      }
    ]
  },
  {
    path: '/project',
    component: Layout,
    redirect: '/project/',
    name: 'Project',
    meta: {
      title: '研究项目', icon: 'el-icon-bangzhu'
    },
    children: [
      {
        path: '',
        name: 'ProjectList',
        component: () => import('@/views/project/ProjectList'),
        hidden: true
      },
      {
        path: ':projectId',
        name: 'ProjectDetail',
        component: () => import('@/views/project/ProjectDetail'),
        children: [
          {
            path: 'home',
            component: () => import('@/views/project/ProjectHome')
          },
          {
            path: 'patient',
            component: () => import('@/views/project/ProjectPatient')
          },
          {
            path: 'patient/:patientId',
            name: 'patientDetail',
            component: () => import('@/views/patient/PatientDetail')
          },
          {
            path: 'report',
            component: () => import('@/views/project/ProjectReport')
          },
          {
            path: 'questionnaire',
            component: () => import('@/views/questionnaire/Questionnaire')
          },
          {
            path: 'questionnaire-new',
            component: () => import('@/views/questionnaire/QuestionnaireDetail')
          },
          {
            path: 'questionnaire/:questionnaireId',
            component: () => import('@/views/questionnaire/QuestionnaireDetail')
          },
          {
            path: 'questionnaire/:questionnaireId/investigation',
            component: () => import('@/views/investigation/Investigation')
          },
          {
            path: 'questionnaire/:questionnaireId/investigation-new',
            component: () => import('@/views/investigation/InvestigationDetail')
          },
          {
            path: 'questionnaire/:questionnaireId/investigation/:investigationId',
            component: () => import('@/views/investigation/InvestigationDetail')
          },
          {
            path: 'member',
            component: () => import('@/views/project/ProjectMember')
          },
          {
            path: 'center',
            component: () => import('@/views/project/ProjectCenter')
          },
          {
            path: 'plan',
            component: () => import('@/views/plan/plan')
          }
        ]
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

