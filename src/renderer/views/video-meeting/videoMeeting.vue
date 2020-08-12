<template>
  <div>
    <el-card>
      <div class="header-panel justify-content">
        <el-button class="meeting" type="primary" @click="Invitation">开始随访</el-button>
        <el-button class="meeting order" @click="rightOff">邀请随访人</el-button>
      </div>
    </el-card>
    <div class="center-panel justify-content">
      <img src="../../assets/address.png" alt="">
    </div>
    <meeting-invitation-dialog ref="invitation-dialog"></meeting-invitation-dialog>
  </div>
</template>

<script>
  import MeetingInvitationDialog from './MeetingInvitationDialog'
  const { BrowserWindow } = require('electron').remote
  export default {
    name: 'videoMeeting',
    components: {
      MeetingInvitationDialog
    },
    data() {
      const projectId = this.$route.params.projectId
      return {
        projectId
      }
    },
    methods: {
      rightOff() {
        this.$refs['invitation-dialog'].show(this.projectId)
      },
      Invitation() {
        const modalPath = process.env.NODE_ENV === 'development'
          ? `http://localhost:9080/#/meeting`
          : `file://${__dirname}/index.html#beginMeeting`
        let win = new BrowserWindow({
          // frame: false,
          width: 1200,
          height: 900,
          webPreferences: {
            nodeIntegration: true,
            webSecurity: false
          },
          parent: win
        })
        win.loadURL(modalPath)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .justify-content{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .header-panel{
    width: 458px;
    height: 39px;
    margin: 10px auto;
  }
  .meeting{
    width: 270px;
    height: 38px;
  }
  .order{
    margin-left: 39px;
  }
  .center-panel{
    width: 497px;height: 327px;margin: 50px auto;
  }
  .el-dialog >>> .el-dialog__header{
    background: #8c939d;
    padding: 0px;
  }
</style>
