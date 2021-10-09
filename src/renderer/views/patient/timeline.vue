<template>
    <div class="timeline">
        <el-steps :space="70" direction="vertical" :active="active">
            <template v-for="(step, index) in steps">
                <el-step :key="index" v-if="step.type === 'PATIENT'" icon=" ">
                    <template slot="icon"><i class="fa fa-user-o fa-2x" @click="selectItem(step, index)"/></template>
                    <template slot="title"><span @click="selectItem(step, index)">{{step.title}}</span> <el-link @click="openPatientAttachment(step)" icon="el-icon-picture-outline"/></template>
                    <template slot="description"><span>{{step.desc}}</span></template>
                </el-step>
                <el-step :key="index" v-if="step.type === 'PLAN'" icon=" ">
                    <template slot="icon"><i class="fa fa-user-plus fa-2x" @click="addItem(step)"/></template>
					<template slot="title" ><span @click="addItem(step)">{{step.title}}</span></template>
                    <template slot="description">{{step.desc}}</template>
                </el-step>
                <el-step :key="index" v-if="step.type === 'FOLLOW'" icon=" "
                         @click.native="selectItem(step, index)">
					<template slot="icon"><i class="fa fa-address-book-o fa-2x" @click="selectItem(step, index)"/></template>
					<template slot="title"><span @click="selectItem(step, index)">{{step.title}}</span> <el-link @click="openPatientAttachment(step)" icon="el-icon-picture-outline"/></template>
                    <template slot="description">{{step.desc}}</template>
                </el-step>
            </template>
            <el-step title="结束" icon="fa fa-smile-o fa-2x"></el-step>
        </el-steps>
    </div>
</template>

<script>
  import moment from 'moment'
  import store from '../../store'
export default {
    name: 'timeline',
    components: { },
    props: {
      timeline: {
        type: Object
      },
      canAddItem: {
        type: Boolean
      }
    },
    data() {
      return {
        steps: [],
        active: 1
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        const steps = []
        if (this.timeline && this.timeline.steps) {
          this.timeline.steps.forEach((step) => {
            steps.push(step)
            if (step.items) {
              step.items.forEach((item) => {
                steps.push(item)
              })
            }
          })
        }
        this.steps = steps
      },
      format(date) {
        if (!date) {
          return null
        }
        return moment().format('YYYY-MM-DD')
      },
      addItem(step) {
        if (this.canAddItem) {
          this.reset()
          let item = {}
          item = Object.assign({}, item, {
            title: this.format(new Date()),
            type: 'FOLLOW',
            patientId: step.patientId,
            planId: step.planId,
            reportId: step.reportId
          })
          step.items.push(item)
          this.init()
          for (let i = 0; i < this.steps.length; i++) {
            if (this.steps[i] === item) {
              this.selectItem(item, i)
            }
          }
        }
      },
      selectItem(step, index) {
        this.active = index + 1
        this.$emit('stepChange', step)
      },
      reset() {
        this.timeline.steps.forEach((step) => {
          const items = step.items
          let index = -1
          for (let i = 0; i < items.length; i++) {
            const item = items[i]
            if (item.type === 'FOLLOW' && !item.followId) {
              index = i
              break
            }
          }
          if (index >= 0) {
            items.splice(index, 1)
          }
        })
      },
      openPatientAttachment(step) {
        const token = store.getters.token
        let routeData = this.$router.resolve({
          path: '/patient-attachment',
          query: {
            access_token: token,
            patientId: step.patientId,
            caseId: step.caseId,
            followId: step.followId
          }
        })
        const url = routeData.href
        console.info('url', url)
        window.open(url, '', 'width=1200,height=800')
      }
    }
  }
</script>

<style scoped>

</style>
