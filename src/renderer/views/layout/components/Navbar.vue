<template>
  <el-menu class="navbar fixed-header"
           mode="horizontal">
    <breadcrumb></breadcrumb>
    <div class="right-menu">
      <div class="right-menu-item">
        <el-tooltip content="帮助" effect="light">
          <i class="el-icon-question" @click="openHelpPage" style="cursor: pointer"></i>
        </el-tooltip>
      </div>
      <remind-component class="right-menu-item"></remind-component>
      <div class="right-menu-item" v-if="!isWeb">
        <export-history></export-history>
      </div>
      <el-dropdown class="right-menu-item avatar-container"
                   trigger="click">
        <div class="row-flex"
             style="margin-top: 10px">
          <div class="line-height30">
            <i class="fa fa-user" aria-hidden="true"></i>
            <span >{{name}}</span>
            <i class="el-icon-caret-bottom"></i>
          </div>
        </div>
        <el-dropdown-menu class="user-dropdown"
                          slot="dropdown">
          <router-link class="inlineBlock"
                       to="/">
            <el-dropdown-item>
              <i class="fa fa-home" aria-hidden="true"></i>
              <span>首页</span>
            </el-dropdown-item>
          </router-link>
          <router-link class="inlineBlock"
                       to="/report">
            <el-dropdown-item>
              <i class="fa fa-fw fa-file-word-o" aria-hidden="true"></i>
              <span>CRF设计</span>
            </el-dropdown-item>
          </router-link>
          <router-link class="inlineBlock"
                       to="/settings">
            <el-dropdown-item>
              <i class="fa fa-fw fa-wrench" aria-hidden="true"></i>
              <span>个人设置</span>
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <i class="fa fa-fw fa-sign-out" aria-hidden="true"></i>
            <span @click="logout">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import { SERVER_API_URL } from '@/constants'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ExportHistory from '../../export/ExportHistory'
import RemindComponent from '@/components/remind/RemindComponent'
var electron
if (!process.env.IS_WEB) {
  electron = require('electron')
}
export default {
  components: {
    RemindComponent,
    ExportHistory,
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name'
    ])
  },
  data() {
    return {
      isWeb: process.env.IS_WEB === true
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    openHelpPage() {
      if (!process.env.IS_WEB) {
        electron.shell.openExternal(`${process.env.BASE_API}/help/index.html`)
      } else {
        window.open(`${SERVER_API_URL}/help/index.html`, '_blank')
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .fixed-header{
    position: fixed;
    top: 0;
    z-index: 9;
    width: 100%;
  }
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  border-top: none;
  border-left: none;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }

  .line-height30 {
    line-height: 30px;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 49px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        position: relative;
        .el-avatar{
          margin-top: 5px;
        }

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>

