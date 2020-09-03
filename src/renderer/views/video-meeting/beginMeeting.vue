<template>
  <div style="background: #5a5e66;">
    <div class="video" id="remote"></div>
    <div class="justify-content" style="align:center;">
      <el-button class="meeting" type="danger" round @click="endFollowUp">结束随访</el-button>
      <el-button class="meeting" type="info" round @click="endAudio" v-show="showHide">
        关闭话筒
        <i class="fa fa-microphone-slash" aria-hidden="true"></i>
      </el-button>
      <el-button class="meeting" type="info" round @click="beginAudio" v-show="!showHide">
        开启话筒
        <i class="fa fa-microphone" aria-hidden="true"></i>
      </el-button>
    </div>
    <div>{{ consoleContainer }}</div>
  </div>
</template>

<script>
  import AgoraRtcEngine from 'agora-electron-sdk'
  import path from 'path'
  import os from 'os'

  import { remote } from 'electron'

  const shell = require('electron').shell
  const AgoraID = 'd17d26b18b574c7c85611c912b5401ce' || ''
  const rtcEngine = new AgoraRtcEngine()
  export default {
    name: 'BeginMeetingDialog',
    data() {
      return {
        showHide: true,
        consoleContainer: String
      }
    },
    mounted() {
      this.beginVideo()
    },
    methods: {
      link: (url) => {
        shell.openExternal(url)
      },
      beginVideo() {
        console.log('1')
        this.$nextTick(function() {
          if (global.rtcEngine) {
            global.rtcEngine.release()
            global.rtcEngine = null
          }
          if (!AgoraID) {
            alert('Please provide AgoraID in App.vue')
            return
          }
          rtcEngine.initialize(AgoraID)
          rtcEngine.on('error', (err, msg) => {
            this.consoleContainer = `error: code ${err} - ${msg}`
          })
          rtcEngine.on('userJoined', (uid) => {
            // setup render area for joined user
            let remoteVideoContainer = document.querySelector('#remote')
            rtcEngine.setupViewContentMode(uid, 1)
            rtcEngine.subscribe(uid, remoteVideoContainer)
          })
          // set channel profile, 0: video call, 1: live broadcasting
          rtcEngine.setChannelProfile(1)
          rtcEngine.setClientRole(1)
          // enable video, call disableVideo() is you don't need video at all
          rtcEngine.enableVideo()
          const logpath = path.join(os.homedir(), 'agorasdk.log')
          // set where log file should be put for problem diagnostic
          rtcEngine.setLogFile(logpath)
          // join channel to rock!
          rtcEngine.joinChannel(null, '111111', null, Math.floor(new Date().getTime() / 1000))
          global.rtcEngine = rtcEngine
        })
      },
      endFollowUp() {
        rtcEngine.leaveChannel()
        remote.getCurrentWindow().close()
      },
      endAudio() {
        this.showHide = false
        rtcEngine.disableAudio()
      },
      beginAudio() {
        this.showHide = true
        rtcEngine.enableAudio()
      }
    }
  }
</script>

<style scoped>
  .hello {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .video {
    width: 1200px;
    height: 400px;
    overflow: hidden;
    margin: 10px;
  }
  .justify-content{
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
