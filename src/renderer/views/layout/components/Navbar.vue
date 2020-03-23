<template>
  <el-menu class="navbar"
           mode="horizontal">
    <breadcrumb></breadcrumb>
    <div class="right-menu">
      <el-tooltip
              :content="'导出记录'"
              effect="dark"
              placement="bottom">
      </el-tooltip>
      <div class="right-menu-item">
        <ExportHistory ></ExportHistory>
      </div>
      <el-dropdown class="right-menu-item avatar-container"
                   trigger="click">
        <div class="row-flex"
             style="margin-top: 10px">
          <span class="line-height30">{{name}}</span>
          <i class="el-icon-caret-bottom line-height30"></i>
        </div>
        <el-dropdown-menu class="user-dropdown"
                          slot="dropdown">
          <router-link class="inlineBlock"
                       to="/">
            <el-dropdown-item>
              Home
            </el-dropdown-item>
          </router-link>
          <router-link class="inlineBlock"
                       to="/report">
            <el-dropdown-item>
              CRF
            </el-dropdown-item>
          </router-link>
          <router-link class="inlineBlock"
                       to="/settings">
            <el-dropdown-item>
              setting
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
          <span @click="logout"
                style="display:block;">LogOut</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ExportHistory from '../../export/ExportHistory'

export default {
  components: {
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
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
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
    line-height: 50px;

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

