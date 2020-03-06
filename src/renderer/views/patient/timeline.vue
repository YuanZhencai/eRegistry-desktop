<template>
    <div class="timeline">
        <el-steps direction="vertical" :active="timeline.current">
            <el-step v-for="(step, index) in steps" :key="index" :title="step.title" :description="step.desc">
            </el-step>
        </el-steps>
    </div>
</template>

<script>
  export default {
    name: 'timeline',
    props: {
      timeline: {
        type: Object,
        default: function() {
          return {
            current: 0,
            steps: []
          }
        }
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
    }
  }
</script>

<style scoped>

</style>
