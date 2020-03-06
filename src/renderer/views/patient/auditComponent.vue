<template>
    <ul>
        <li class="media row-flex" v-for="audit in audits">
            <el-avatar icon="el-icon-user-solid"></el-avatar>{{audit.createdBy}}
            <div class="media-body">
                <div>
                    <h5>{{audit.createdBy}}<small>{{audit.createdDate | formatDate('YYYY-MM-DD')}}</small></h5>
                </div>
                <p v-if="audit.opinion"><span>{{AuditState[audit.state]}}</span>{{audit.opinion}}</p>
                <p v-else>{{AuditState[audit.state]}}</p>
            </div>
        </li>
    </ul>
</template>

<script>
  export default {
    props: {
      audits: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        AuditState: {
          'null': '',
          'CHANGE_SUBMIT': '申请变更',
          'CHANGE_APPROVE': '同意变更',
          'CHANGE_REFUSE': '拒绝变更',
          'SUBMIT': '提交审核',
          'WITHDRAWAL': '撤回',
          'APPROVE': '通过',
          'REFUSE': '退回'
        }
      }
    }
  }
</script>

<style scoped>

</style>
