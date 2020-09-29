<template>
	<div class="content">
		<div class="hello">
			<div v-show="!userJoined" class="video" id="local"></div>
			<div v-show="userJoined" class="video" id="remote"></div>
		</div>
		<div class="justify-content" style="align:center;">
			<el-button class="meeting" type="danger" round @click="finish">结束随访</el-button>
			<el-button class="meeting" type="info" round @click="disableAudio" v-show="audioEnabled">
				关闭话筒
				<i class="fa fa-microphone-slash" aria-hidden="true"></i>
			</el-button>
			<el-button class="meeting" type="info" round @click="enableAudio" v-show="!audioEnabled">
				开启话筒
				<i class="fa fa-microphone" aria-hidden="true"></i>
			</el-button>
		</div>
	</div>
</template>

<script>
	import AgoraRtcEngine from 'agora-electron-sdk'
	import path from 'path'
	import os from 'os'

	import { remote } from 'electron'
	import { Message } from 'element-ui'
	import { AGORA_ID } from '../constants'
	const AgoraID = AGORA_ID || ''
	const rtcEngine = new AgoraRtcEngine()
	export default {
	  name: 'PVideo',
	  data() {
	    return {
	      userJoined: false,
	      audioEnabled: false,
	      consoleContainer: String
	    }
	  },
	  mounted() {
	    this.beginVideo()
	  },
	  methods: {
	    beginVideo() {
	      const params = this.getQueryParams()
	      const roomId = params['roomId']
	      const user = params['user']

	      this.$nextTick(function() {
	        if (!roomId) {
	          Message.error('会议号不能为空，或者会议已经结束')
	        }
	        if (!user) {
	          Message.error('用户名不能为空')
	        }
	        if (global.rtcEngine) {
	          global.rtcEngine.release()
	          global.rtcEngine = null
	        }
	        if (!AgoraID) {
	          Message.error('视频初始化参数错误，请联系管理员')
	          return
	        }
	        rtcEngine.initialize(AgoraID)
	        // listen to events
	        rtcEngine.on('joinedChannel', (channel, uid, elapsed) => {
	          this.consoleContainer = `join channel success ${channel} ${uid} ${elapsed}`
	          let localVideoContainer = document.querySelector('#local')
	          // setup render area for local user
	          rtcEngine.setupLocalVideo(localVideoContainer)
	        })
	        rtcEngine.on('error', (err, msg) => {
	          Message.error(`错误：${err} - ${msg}`)
	        })
	        rtcEngine.on('userJoined', (uid) => {
	          // setup render area for joined user
	          this.userJoined = true
	          let remoteVideoContainer = document.querySelector('#remote')
	          rtcEngine.setupViewContentMode(uid, 1)
	          rtcEngine.subscribe(uid, remoteVideoContainer)
	        })
	        rtcEngine.on('removeStream', (uid) => {
	          // setup render area for joined user
	          this.userJoined = false
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
	        // rtcEngine.joinChannel(null, this.roomId, null, Math.floor(new Date().getTime() / 1000))
	        console.info('joinChannelWithUserAccount', user)
	        rtcEngine.joinChannelWithUserAccount(null, roomId, user)
	        global.rtcEngine = rtcEngine
	      })
	    },
	    getQueryParams() {
	      // const url = remote.getCurrentWindow().webContents.getURL()
	      const url = global.location.search
	      const params = {}
	      if (url.indexOf('?') > -1) {
	        const queries = url.split('?')[1].split('&')
	        for (let i = 0; i < queries.length; i++) {
	          const query = queries[i]
	          const keyAndValue = query.split('=')
	          params[keyAndValue[0]] = keyAndValue[1]
	        }
	      }
	      return params
	    },
	    finish() {
	      rtcEngine.leaveChannel()
	      remote.getCurrentWindow().close()
	    },
	    disableAudio() {
	      this.audioEnabled = false
	      rtcEngine.disableAudio()
	    },
	    enableAudio() {
	      this.audioEnabled = true
	      rtcEngine.enableAudio()
	    }
	  }
	}
</script>

<style scoped>
  .content {
    background: #5a5e66;
    height: 100%;
  }
	.hello {
    height: 650px;
		display: flex;
		justify-content: center;
		align-items: center;
    background: #5a5e66;
    padding: 30px 10px;
	}
	.video {
    width: 100%;
    height: 100%;
		overflow: hidden;
	}
	.justify-content{
    background: #5a5e66;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
