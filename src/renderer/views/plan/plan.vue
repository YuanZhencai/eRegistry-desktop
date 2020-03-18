<template>
  <div class="app-container">
    <el-button type="primary"
               @click="headerCreatePlan">创建随访计划</el-button>
    <el-table :data="followList"
              style="width: 100%">
      <el-table-column prop="name"
                       label="名称"
                       width="180">
      </el-table-column>
      <el-table-column prop="condition"
                       label="第几天开始"
                       width="180">
      </el-table-column>
      <el-table-column prop="remindingInterval"
                       label="提醒区间">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small"
                     type="primary"
                     @click="editPlan(scope.row.id)">
            编辑
          </el-button>
          <el-button size="small"
                     type="danger"
                     @click="planDeleteDialog(scope.row)">删除</el-button>
          <el-button type="info"
                     size="small"
                     @click="report(scope.row)">
            <span>CRF</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="textMap[dialogStatus]"
               :visible.sync="editCreateDialog"
               width="40%">
      <el-form :model="dialogFormData"
               :rules="rules"
               ref="headerCreatePlan"
               label-width="100px">
        <el-form-item label="名称:"
                      prop="name">
          <el-input v-model="dialogFormData.name"></el-input>
        </el-form-item>
        <el-form-item label="CRF模板:">
          <el-select v-model="value"
                     placeholder="请选择CRF随访模板">
            <el-option v-for="item in crflistData"
                       :key="item.id"
                       :label="item.title"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="第几天开始:"
                      prop="condition">
          <el-input v-model="dialogFormData.condition"></el-input>
        </el-form-item>
        <el-form-item label="提醒区间(天):">
          <el-input v-model="dialogFormData.remindingInterval"></el-input>
        </el-form-item>
        <el-form-item label="简介">
          <el-input type="textarea"
                    v-model="dialogFormData.introduction"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editCreateDialog = false">取 消</el-button>
        <el-button type="primary"
                   @click="dialogStatus==='create'?createPlan():updatePlan()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="确认删除"
               :visible.sync="deleteDialogVisible"
               width="30%"
               :data="deleteDialoglist">
      <p>你确定要删除随访计划<span style="color:red"> {{deleteDialoglist.name}} </span>吗？</p>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="confirmDelete(deleteDialoglist.id)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分页 -->
    <el-pagination background
                   :page-size="listQuery.limit"
                   :current-page="listQuery.page+1"
                   @size-change="sizeChange"
                   @current-change="currentChange"
                   layout="prev, pager, next"
                   :total="total">
    </el-pagination>
  </div>
</template>
<script>
import { getplanData, getedit, crflist, deleteData, putData, postData } from '@/api/PlanService'
export default {
  data() {
    const projectId = this.$route.params.projectId
    return {
      followList: [],
      deleteDialoglist: [],
      total: 0,
      listQuery: {
        page: 0,
        limit: 10,
        sort: '+id'
      },
      rules: {
        name: [{ required: true, message: '本字段不能为空', trigger: 'change' }],
        condition: [{ required: true, message: '本字段不能为空', trigger: 'change' }]
      },
      dialogStatus: '',
      textMap: {
        update: '编辑随访计划',
        create: '创建随访计划'
      },
      projectId,
      crflistData: [],
      dialogFormData: {},
      editCreateDialog: false,
      deleteDialogVisible: false,
      value: ''
    }
  },
  mounted() {
    this.getplan()
  },
  methods: {
    sizeChange(size) {
      this.listQuery.limit = size
      this.getplan()
    },
    currentChange(page) {
      this.listQuery.page = page - 1
      this.getplan()
    },
    async getplan() {
      const data = {
        'EQ_plan.projectId': this.projectId,
        'EQ_plan.deleted': false,
        page: this.listQuery.page || 0,
        size: this.listQuery.size || 10
      }
      try {
        await getplanData(data).then((res) => {
          this.followList = res.data
          this.total = Number(res.headers['x-total-count'])
        })
      } catch (e) {
        console.log(e)
      }
    },
    async headerCreatePlan(dialogFormData) {
      this.dialogStatus = 'create'
      this.dialogFormData = {}
      this.value = ''
      try {
        await crflist().then((res) => {
          this.crflistData = res.data
          this.editCreateDialog = true
        })
      } catch (e) {
        console.log(e)
      }
    },
    async createPlan() {
      try {
        await crflist().then((res) => {
          this.crflistData = res.data
        })
        this.dialogFormData['projectId'] = this.projectId
        this.dialogFormData['reportId'] = this.value
        await postData(this.dialogFormData).then((res) => { })
        this.$nextTick(() => {
          this.editCreateDialog = false
          this.$notify({
            title: '成功',
            message: '新建成功',
            type: 'success',
            duration: 2000
          })
        })
        this.getplan()
      } catch (e) {
        console.log(e)
      }
    },
    async editPlan(id) {
      this.dialogStatus = 'update'
      this.editCreateDialog = true
      try {
        await getedit(id).then((res) => {
          this.dialogFormData = res.data
        })
        await crflist().then((res) => {
          this.crflistData = res.data
        })
        for (let i = 0; i < this.crflistData.length; i++) {
          if (this.dialogFormData.reportId === this.crflistData[i].id) {
            this.value = this.crflistData[i].title
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    async updatePlan() {
      await putData(this.dialogFormData).then((res) => { })
      this.$nextTick(() => {
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
      })
      this.editCreateDialog = false
      this.getplan()
    },
    planDeleteDialog(questionnaire) {
      this.deleteDialogVisible = true
      this.deleteDialoglist = questionnaire
    },
    async confirmDelete(id) {
      try {
        await deleteData(id).then((res) => { })
        this.deleteDialogVisible = false
      } catch (e) {
        console.log(e)
      }
      this.getplan()
    },
    report(plan) {
      this.$router.push({
        path: `/project/${this.projectId}/plan/${plan.id}/report`
      })
    }
  }
}
</script> 
