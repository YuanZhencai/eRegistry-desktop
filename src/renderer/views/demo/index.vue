<template>
  <el-row>
    <el-col :span="12">
      <div class="grid-content bg-purple-dark">
        <span style="border: 2px solid #606266"></span>
        <span style="margin-left: 5px;">患者调查</span>
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </el-col>
    <el-col>

    </el-col>
  </el-row>

</template>

<script>
  export default {
    name: 'index',
    data() {
      return {
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: ''
      }
    }
  }
</script>

<style scoped>

</style>
