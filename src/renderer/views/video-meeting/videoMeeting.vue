<template>
  <div>
<!--    <el-card style="overflow: hidden">-->
<!--      <span style="font-size: 15px;">-->
<!--        视频会议-->
<!--      </span>-->
<!--      <span style="font-size: 20px;color: #1890ff;float: right;">-->
<!--        <i class="el-icon-plus"></i>-->
<!--      </span>-->
<!--    </el-card>-->
    <el-card>
      <div class="header-panel justify-content">
        <el-button class="meeting" type="primary" @click="rightOff">马上开会</el-button>
        <el-button class="meeting order" @click="Invitation">预约开会</el-button>
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
        const modalPath = process.env.NODE_ENV === 'development'
          ? `http://192.168.3.247:20002/reg/#/project/${this.projectId}/log`
          : `file://${__dirname}/index.html#beginMeeting`
        console.log(modalPath, '1111111')
        let win = new BrowserWindow({
          // frame: false,
          width: 800,
          height: 600,
          webPreferences: {
            webSecurity: false
          },
          parent: win
        })
        win.loadURL(modalPath)
        win.on('closed', () => {
          win = null
        })
      },
      Invitation() {
        this.$refs['invitation-dialog'].show(this.projectId)
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
