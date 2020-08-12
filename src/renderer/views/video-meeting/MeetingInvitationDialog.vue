<template>
  <el-dialog title="会议邀请" :visible.sync="display">
    <el-row>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <div class="personnel">
            <span class="user">{{ name }}</span>
            <el-tag
              v-show="checkOnly"
              class="tag"
              closable
              @close="remove(patientName)"
              size="medium"
              type="info">
              {{ patientName }}
            </el-tag>
            <el-input v-model="queryName" placeholder="搜索患者" size="mini" suffix-icon="el-icon-search" style="width: 100px;border: none;"
                      @change="searchPatient"></el-input>
          </div>
          <el-row class="btn_foot">
            <el-button type="primary" class="confirm" :disabled="confirm">确定</el-button>
            <el-button type="info" plain class="cancel">取 消</el-button>
          </el-row>
        </div>
      </el-col>
      <el-col :span="12" style="border-left: 1px solid #f0f2f5;height: 400px;">
        <div class="grid-content bg-purple-light" v-show="showHide">
          <div class="grouping" @click="patientShow">
              <img style="width: 50px;height: 50px;margin: 15px 10px 15px 25px" src="../../assets/user.png" alt="">
            <span class="patient">我的患者</span>
          </div>
        </div>
        <div v-show="!showHide">
          <div class="personnel">
            <div style="color: #000;font-size: 15px;margin: 10px 15px;cursor: pointer;" @click="showHide=!showHide">
              <i class="el-icon-arrow-left"></i>
              我的患者
            </div>
            <div style="margin: 5px 15px;overflow: auto;height: 310px;">
              <el-radio-group v-model="checkedName" v-infinite-scroll="load" @change="patient">
                <div v-for="(item,index) in patients" :key="index" style="margin: 10px 5px;">
                  <el-radio :label="item">{{ item.name }}</el-radio>
                </div>
              </el-radio-group>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
  import { getProjectPatients } from '@/api/PatientService'
  import { mapGetters } from 'vuex'
  const patientOptions = []
  export default {
    name: 'MeetingInvitationDialog',
    data() {
      const projectId = this.$route.params.projectId
      return {
        projectId,
        total: 0,
        pageSize: 10, // 单页数据量
        currentPage: 1, // 默认开始页面
        display: false,
        confirm: true,
        showHide: true,
        checkOnly: false,
        checkedName: '',
        patients: [],
        cities: patientOptions,
        arr: [],
        array: [],
        queryName: null,
        patientName: null
      }
    },
    computed: {
      ...mapGetters([
        'name'
      ]),
      noMore() {
        return !(this.patients.length < this.total)
      }
    },
    methods: {
      show() {
        this.display = true
        this.remove()
      },
      load() {
        if (!this.noMore) {
          this.currentPage = this.currentPage + 1
          this.queryPatient()
        }
      },
      patientShow() {
        this.showHide = !this.showHide
        this.patients = []
        this.currentPage = 1
        this.queryPatient()
      },
      queryPatient() {
        getProjectPatients(this.projectId, {
          page: this.currentPage - 1,
          size: this.pageSize,
          'EQ_patient.name': this.queryName
        }).then((res) => {
          this.patients = this.patients.concat(res.data)
          this.total = Number(res.headers['x-total-count'])
        })
      },
      searchPatient() {
        this.showHide = false
        console.log(this.queryName)
        if (this.queryName === '') {
          this.queryName = null
        }
        this.queryPatient()
      },
      patient() {
        this.checkOnly = true
        this.patientName = this.checkedName.name
        this.confirm = false
      },
      remove() {
        this.checkOnly = false
        this.patientName = null
        this.checkedName = null
        this.confirm = true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .personnel{
    height: 400px;
    .tag{
      margin: 2px 3px;
      height: 32px;
      line-height: 32px;
    }
  }
  .user{
    border: 1px dashed #000;
    border-radius: 5px;
    padding: 5px;
  }

  .btn_foot{
    margin-top: 15px;
    display: flex;
    align-items: flex-end;
    .confirm{
      width: 117px;
      height: 36px;
      font-size: 15px;
    }
    .cancel{
      height: 36px;
      font-size: 15px;
      color: #000;
    }
  }
  .bg-purple-light{
    .grouping{
      border-bottom: 1px solid #f0f2f5;
      flex-wrap:wrap;
      display: flex;
      .patient{
        line-height: 80px;
        color: #000;
        font-size: 15px;
      }
    }
  }
</style>
