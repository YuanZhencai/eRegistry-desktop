<template>
    <div class="timeline">
        <el-steps :space="70" direction="vertical" :active="timeline.current"
                  finish-status="success">
            <template v-for="(step, index) in steps">
                <el-step :key="index" v-if="step.type === 'PATIENT'" icon="fa fa-user-o fa-2x"
                         @click.native="selectItem(step, index)">
                    <template slot="title">{{step.title}}</template>
                    <template slot="description">{{step.desc}}</template>
                </el-step>
                <el-step :key="index" v-if="step.type === 'PLAN'" icon="fa fa-user-plus fa-2x"
                         @click.native="addItem(step)">
                    <template slot="title">{{step.title}}</template>
                    <template slot="description">{{step.desc}}</template>
                </el-step>
                <el-step :key="index" v-if="step.type === 'FOLLOW'" icon="fa fa-address-book-o fa-2x"
                         @click.native="selectItem(step, index)">
                    <template slot="title">{{step.title}}</template>
                    <template slot="description">{{step.desc}}</template>
                </el-step>
            </template>
            <el-step title="结束" icon="fa fa-smile-o fa-2x"></el-step>
        </el-steps>
    </div>
</template>

<script>
  import moment from 'moment'
  export default {
    name: 'timeline',
    props: {
      timeline: {
        type: Object
      },
      canAddItem: {
        type: Boolean
      }
    },
    data() {
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
      return {
        steps
      }
    },
    created() {},
    methods: {
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
        }
      },
      selectItem(step, index) {
        this.$emit('stepChange', { current: index, step })
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
      }
    }
  }
</script>

<style scoped>

</style>
