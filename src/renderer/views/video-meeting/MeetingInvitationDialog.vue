<template>
  <el-dialog title="会议邀请" :visible.sync="display">
    <el-row>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <div class="personnel">
            <span class="user">username</span>
            <el-tag
              class="tag"
              closable
              size="medium"
              type="info">
              会议邀请
            </el-tag>
            <el-tag
              class="tag"
              closable
              size="medium"
              type="info">
              会议邀请
            </el-tag>
            <el-tag
              class="tag"
              closable
              size="medium"
              type="info">
              会议邀请
            </el-tag>
            <el-autocomplete style="margin-top: 3px;"
              class="inline-input"
              v-model="state2"
              :fetch-suggestions="querySearch"
              placeholder="搜索"
              :trigger-on-focus="false"
              @select="handleSelect"
            ></el-autocomplete>
          </div>
          <el-row class="btn_foot">
            <el-button type="primary" class="confirm" disabled>确定(0/1)</el-button>
            <el-button type="info" plain class="cancel">取 消</el-button>
          </el-row>
        </div>
      </el-col>
      <el-col :span="12" style="border-left: 1px solid #f0f2f5;height: 400px;">
        <div class="grid-content bg-purple-light" v-show="patientList">
          <div class="grouping" @click="patientShow">
              <img style="width: 50px;height: 50px;margin: 15px 10px 15px 25px" src="../../assets/user.png" alt="">
            <span class="patient">我的患者</span>
          </div>
        </div>
        <div v-show="!patientList">
          <div class="personnel">
            <div style="color: #000;font-size: 15px;margin: 10px 15px;cursor: pointer;" @click="patientList=!patientList">
              <i class="el-icon-arrow-left"></i>
              我的患者
            </div>
            <div style="margin: 5px 15px;">
              <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                <div v-for="item in cities" >
                  <el-checkbox :label="item" :key="item">{{ item.PatientName }}</el-checkbox>
                </div>
              </el-checkbox-group>
            </div>
          </div>
          <el-pagination background
                         :current-page="currentPage"
                         :page-size="pageSize"
                         layout="total, prev, pager, next, jumper"
                         :total="total"
                         @current-change="currentChange"
                         class="pagination">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
  import { getProjectPatients } from '@/api/PatientService'
  const cityOptions = []
  export default {
    name: 'MeetingInvitationDialog',
    data() {
      const projectId = this.$route.params.projectId
      return {
        projectId,
        display: false,
        total: 0,
        pageSize: 10, // 单页数据量
        currentPage: 1, // 默认开始页面
        Ninja: true,
        patientList: true,
        checkAll: false,
        checkedCities: [],
        patients: [],
        cities: cityOptions
        // isIndeterminate: true
      }
    },
    methods: {
      show() {
        this.display = true
      },
      handleCheckedCitiesChange(value) {
        const checkedCount = value.length
        this.checkAll = checkedCount === this.cities.length
        // this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
      },
      patientShow() {
        this.patientList = !this.patientList
        this.queryPatient()
      },
      async queryPatient() {
        await getProjectPatients(this.projectId, {
          page: this.currentPage - 1,
          size: this.pageSize
        }).then((res) => {
          this.patients = res.data
          this.patients.forEach(function(item) {
            cityOptions.push({ PatientName: item.name })
          })
          this.total = Number(res.headers['x-total-count'])
        })
      },
      currentChange: function(currentPage) {
        this.currentPage = currentPage
        this.queryPatient()
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
