<template>
    <el-dialog title="创建或编辑分中心成员" :visible.sync="visible" :before-close="closeDialog">
        <el-form label-width="80px">
            <el-form-item label="成员">
                <el-input v-model="centerMember.username" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="分中心">
                <el-select placeholder="选择分中心" v-model="centerMember.centerId">
                    <el-option v-for="center in centers" :key="center.id"
                               :label="center.name"
                               :value="center.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click="closeDialog">取 消</el-button>
            <el-button size="mini" type="primary" @click="confirm">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
  import { getProjectCenters } from '@/api/CenterResource'
  import { createCenterMember, updateCenterMember } from '@/api/CenterMemberResource'
  export default {
    name: 'AssignMemberDialog',
    props: {
      visible: {
        type: Boolean
      },
      centerMember: {
        type: Object
      }
    },
    data() {
      return {
        centers: [],
        projectId: 20002,
        centerId: null
      }
    },
    created() {
      this.findCenters()
      this.centerId = this.centerMember.centerId
    },
    methods: {
      findCenters: function() {
        getProjectCenters(this.projectId).then((res) => {
          this.centers = res.data
        })
      },
      closeDialog() {
        this.$emit('closeDialog', 'assignMember')
      },
      confirm() {
        if (this.centerId) {
          updateCenterMember(this.centerMember).then(response => {
          })
        } else {
          createCenterMember(this.centerMember).then(response => {})
        }
      }
    }
  }
</script>

<style scoped>

</style>
