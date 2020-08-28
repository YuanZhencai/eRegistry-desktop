<template>
  <div>
    <el-card>
      <div class="header-panel justify-content">
        <el-button class="meeting" type="primary" @click="createMeeting">开始随访</el-button>
·       <el-button class="meeting order" @click="videoList">会议记录列表</el-button>
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
import { getProjectMeetings } from '../../api/MeetingService'
export default {
  name: 'Meeting',
  components: {
    MeetingInvitationDialog,
    UserAvatar
  },
  data() {
    const projectId = this.$route.params.projectId
    return {
      projectId,
      meeting: null,
      meetings: [],
      showHide: true
    }
  },
  mounted() {
    this.onVideoFinish()
  },
  methods: {
    videoList() {
      this.showHide = !this.showHide
      if (!this.showHide) {
        this.findMeetings()
      }
    },
    openVideoWindow(meeting) {
      if (!process.env.IS_WEB) {
        const electron = require('electron')
        electron.ipcRenderer.send('open-video', {
          path: `/#/video?roomId=${meeting.roomId}`
        })
      }
    },
    createMeeting() {
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
      this.openVideoWindow(meeting)
    },
    onVideoFinish() {
      if (!process.env.IS_WEB) {
        const electron = require('electron')
        electron.ipcRenderer.on('finish-video', async(event) => {
          this.meeting = null
          this.findMeetings()
        })
      }
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
