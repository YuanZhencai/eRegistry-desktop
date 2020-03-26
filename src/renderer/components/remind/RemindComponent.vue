<template>
    <div>
        <el-badge class="notification-badge" :value="total" style="cursor: pointer">
            <el-popover
                    title="随访提醒"
                    placement="bottom"
                    width="250" popper-class="notification-popper"
                    trigger="click" style="padding-right: 0;">
                <div>
                    <div v-if="reminds.length === 0" class="text-center">
                        <el-image :src="img_bell"></el-image>
                        <p>没有即将随访的病例</p>
                    </div>
                    <div v-if="reminds.length > 0" class="infinite-list-wrapper" style="overflow: auto">
                        <ul class="list-group no-margin-bottom" v-infinite-scroll="load" infinite-scroll-disabled="disabled">
                            <li class="list-group-item" v-for="remind in reminds" :key="remind.id">
                                <div class="row-flex space-between">
                                    <h5 class="patient-name">{{remind.patientName}}</h5>
                                    <small>{{remind.followDate | formatDate('YYYY-MM-DD')}}</small>
                                </div>
                                <p class="project-name">{{remind.projectName}}</p>
                                <small>{{remind.planName}}</small>
                            </li>
                        </ul>
                    </div>
                    <p v-if="loading">加载中...</p>
                </div>
                <i class="el-icon-message-solid" slot="reference"></i>
            </el-popover>
        </el-badge>
    </div>
</template>

<script>
  import img_bell from '@/assets/bell.png'
  import { getFollowRemindingCases } from '@/api/FollowService'
  export default {
    name: 'RemindComponent',
    data() {
      return {
        img_bell,
        currentPage: 1,
        pageSize: 10,
        reminds: [],
        loading: false,
        total: 0
      }
    },
    computed: {
      noMore() {
        return !(this.reminds.length < this.total)
      },
      disabled() {
        return this.loading || this.noMore
      }
    },
    created() {
      this.findReminds()
    },
    methods: {
      load() {
        if (!this.noMore) {
          this.currentPage = this.currentPage + 1
          this.findReminds()
        }
      },
      findReminds() {
        const that = this
        this.loading = true
        getFollowRemindingCases({
          page: this.currentPage - 1,
          size: this.pageSize
        }).then((res) => {
          res.data.forEach((item) => {
            that.reminds.push(item)
          })
          that.loading = false
          that.total = Number(res.headers['x-total-count'])
        })
      }
    }
  }
</script>

<style scoped>

.infinite-list-wrapper{
    height: 200px;
    padding: 0;
    margin: 0;
    list-style: none;
}
.list-group-item{
    border-left: none;
    border-right: none;
}
.list-group-item .patient-name{
    margin: 0;
    font-size: 18px
}
.list-group-item .project-name {
    margin-bottom: .25rem;
}
</style>
