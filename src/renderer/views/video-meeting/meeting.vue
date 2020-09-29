<template>
  <div>
    <el-card>
      <div class="header-panel justify-content">
        <el-button class="meeting" type="primary" @click="createMeeting">开始视频随访</el-button>
        <el-button class="meeting order" @click="videoList">会议记录列表</el-button>
      </div>
    </el-card>
    <div class="center-panel justify-content" v-show="showHide">
      <img src="../../assets/address.png" alt="">
    </div>
    <div v-show="!showHide">
      <el-table
        :data="meetings"
        style="width: 100%">
        <el-table-column
          width="80">
          <template slot-scope="scope">
              <div v-for="participant in scope.row.participants" :key="participant">
                  <user-avatar :username="participant" :size="35"></user-avatar>
              </div>
          </template>
        </el-table-column>
        <el-table-column
          width="320">
          <template slot-scope="scope">
            <p>{{scope.row.title}}</p>
            <p>{{scope.row.beginDate | formatDate('YYYY-MM-DD HH:mm')}}</p>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-button
                    @click="enterMeeting(scope.row)"
                    v-if="scope.row.state === 'START'"
                    icon="el-icon-video-camera"
                    circle>
            </el-button>
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
import { finishMeeting, getProjectMeetings } from '../../api/MeetingService'
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'
let electron
if (!process.env.IS_WEB) {
  electron = require('electron')
}
export default {
  name: 'Meeting',
  components: {
    MeetingInvitationDialog,
    UserAvatar
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data() {
    const projectId = this.$route.params.projectId
    return {
      projectId,
      meeting: null,
      meetings: [],
      showHide: true,
      meetingWindow: null
    }
  },
  methods: {
    videoList() {
      this.showHide = !this.showHide
      if (!this.showHide) {
        this.findMeetings()
      }
    },
    async openVideoWindow(meeting) {
      if (!process.env.IS_WEB) {
        const { BrowserWindow } = electron.remote
        if (this.meetingWindow) {
          this.meetingWindow.show()
          this.meetingWindow.focus()
          return this.meetingWindow
        }
        this.meetingWindow = new BrowserWindow({
          title: '视频随访',
          width: 980,
          height: 700,
          minWidth: 720,
          minHeight: 450,
          useContentSize: true,
          resizable: true,
          menu: false,
          modal: process.platform !== 'darwin',
          show: false,
          webPreferences: {
            nodeIntegration: true,
            webSecurity: false
          }
        })

        this.meetingWindow.on('ready-to-show', () => {
          this.meetingWindow.show()
          this.meetingWindow.focus()
        })

        this.meetingWindow.on('close', async(e) => {
          // todo 关闭确认
          console.info('close', e)
        })

        // 窗口关闭后手动让$window为null
        this.meetingWindow.on('closed', (e) => {
          console.info('closed', e)
          this.finishVideo()
          this.meetingWindow = null
        })
        const winURL = process.env.NODE_ENV === 'development'
          ? 'http://localhost:9080/video.html'
          : `file://${__dirname}/video.html`
        const videoURL = `${winURL}?roomId=${meeting.roomId}&user=${this.name}`
        console.info('videoURL', videoURL)
        await this.meetingWindow.loadURL(videoURL)
        return this.meetingWindow
      }
    },
    createMeeting() {
      if (process.env.IS_WEB) {
        Message.warning('视频随访目前只支持桌面版，请下载桌面客户端')
        return
      }
      if (this.meeting) {
        this.openVideoWindow(this.meeting)
      } else {
        this.$refs['invitation-dialog'].show().then((meeting) => {
          this.meeting = meeting
          this.openVideoWindow(this.meeting)
          this.findMeetings()
        }, () => {})
      }
    },
    findMeetings() {
      getProjectMeetings({ projectId: this.projectId }).then((response) => {
        this.meetings = response.data
      })
    },
    enterMeeting(meeting) {
      this.meeting = meeting
      this.openVideoWindow(meeting)
    },
    finishVideo() {
      finishMeeting(this.meeting.roomId).then(res => {
        this.meeting = null
        this.findMeetings()
      })
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
