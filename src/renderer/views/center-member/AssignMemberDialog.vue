<template>
    <el-dialog title="创建或编辑分中心成员" :visible.sync="display" :before-close="close">
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
            <el-button size="mini" type="primary" @click="confirm">确 定</el-button>
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
        memberId: null
      }
    },
    methods: {
      show(memberId) {
        const that = this
        this.memberId = memberId
        this.findCenters()
        this.findCenterMember()
        this.display = true
        return new Promise((resolve, reject) => {
          that.resolve = resolve
          that.reject = reject
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
        const that = this
        if (this.centerId) {
          updateCenterMember(this.centerMember).then(response => {
            this.centerMember = response.data
            that.display = false
            that.resolve(response.data)
          })
        } else {
          createCenterMember(this.centerMember).then(response => {
            this.centerMember = response.data
            that.display = false
            that.resolve(response.data)
          })
        }
      }
    }
  }
</script>

<style scoped>

</style>
