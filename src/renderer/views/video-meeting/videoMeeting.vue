<template>
  <div>
    <el-card>
      <div class="header-panel justify-content">
        <el-button class="meeting" type="primary" @click="Invitation">开始随访</el-button>
        <el-button class="meeting order" @click="rightOff">邀请随访人</el-button>
·        <el-button class="meeting order" @click="videoList">会议记录列表</el-button>
      </div>
    </el-card>
    <div class="center-panel justify-content" v-show="showHide">
      <img src="../../assets/address.png" alt="">
    </div>
    <div v-show="!showHide">
      <el-table
        :data="videoListData"
        style="width: 100%">
        <el-table-column
          width="80">
          <template slot-scope="scope">
<!--            <user-avatar :username="videoListData.url" :size="35"></user-avatar>-->
          </template>
        </el-table-column>
        <el-table-column
          width="320">
          <template slot-scope="scope">
            <p>{11{videoListData}111}</p>
            <p>{22{scope}33}</p>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-button icon="el-icon-video-camera" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <meeting-invitation-dialog ref="invitation-dialog"></meeting-invitation-dialog>
  </div>
</template>

<script>
  import MeetingInvitationDialog from './MeetingInvitationDialog'
  import UserAvatar from '@/components/avatar/userAvatar'
  const { BrowserWindow } = require('electron').remote
  export default {
    name: 'videoMeeting',
    components: {
      MeetingInvitationDialog,
      UserAvatar
    },
    data() {
      const projectId = this.$route.params.projectId
      return {
        projectId,
        showHide: true,
        videoListData: [
          {
            url: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            date: '2016-05-02',
            name: '王小虎发起的视频会议'
          }, {
            url: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            date: '2016-05-04',
            name: '王小发起的视频会议'
          }, {
            url: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            date: '2016-05-01',
            name: '小虎发起的视频会议'
          }, {
            url: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            date: '2016-05-03',
            name: '王虎发起的视频会议'
          }
        ]
      }
    },
    methods: {
      rightOff() {
        this.$refs['invitation-dialog'].show(this.projectId)
      },
      Invitation() {
        const modalPath = process.env.NODE_ENV === 'development'
          ? `http://localhost:9080/#/meeting`
          : `file://${__dirname}/index.html#meeting`
        let win = new BrowserWindow({
          // frame: false,
          width: 1200,
          height: 800,
          webPreferences: {
            nodeIntegration: true,
            webSecurity: false
          }
        })
        win.loadURL(modalPath)
      },
      videoList() {
        this.showHide = !this.showHide
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
