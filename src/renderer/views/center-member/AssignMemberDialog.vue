<template>
    <el-dialog title="创建或编辑分中心成员" width="500px" :visible.sync="display" :before-close="close">
        <el-form label-width="80px" size="mini">
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
            <el-button size="mini" @click="cancel">取 消</el-button>
            <el-button size="mini" type="primary" :disabled="isSaving" @click="confirm">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
  import { getAllCenters } from '@/api/CenterService'
  import { createCenterMember, updateCenterMember, getCenterMemberByMemberId } from '@/api/CenterMemberService'
  export default {
    name: 'AssignMemberDialog',
    data() {
      const projectId = this.$route.params.projectId
      return {
        centers: [],
        projectId,
        centerMember: { username: null },
        centerId: null,
        display: false,
        reject: null,
        resolve: null,
        memberId: null,
        isSaving: false
      }
    },
    methods: {
      show(memberId) {
        this.memberId = memberId
        this.findCenters()
        this.findCenterMember()
        this.display = true
        return new Promise((resolve, reject) => {
          this.resolve = resolve
          this.reject = reject
        })
      },
      findCenters: function() {
        getAllCenters({ 'EQ_center.projectId': this.projectId }).then((res) => {
          this.centers = res.data
        })
      },
      findCenterMember: function() {
        getCenterMemberByMemberId(this.memberId).then(res => {
          this.centerMember = res.data
          this.centerId = this.centerMember.centerId
        })
      },
      cancel() {
        this.display = false
        this.reject('cancel')
      },
      close() {
        this.display = false
        this.reject('close')
      },
      confirm() {
        this.isSaving = true
        if (this.centerId) {
          updateCenterMember(this.centerMember).then(response => {
            this.isSaving = false
            this.centerMember = response.data
            this.display = false
            this.resolve(response.data)
          }, () => {
            this.isSaving = false
          })
        } else {
          createCenterMember(this.centerMember).then(response => {
            this.isSaving = false
            this.centerMember = response.data
            this.display = false
            this.resolve(response.data)
          }, () => {
            this.isSaving = false
          })
        }
      }
    }
  }
</script>

<style scoped>

</style>
