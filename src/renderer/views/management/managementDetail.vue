<template>
  <div :data="complexs">
    <h2>用户[ {{ complexs.login }} ]</h2>
    <el-form
      label-position="left"
      inline
      class="demo-table-expand"
    >
      <el-form-item label="登录">
        <span>{{ complexs.login }}</span>
      </el-form-item>
      <el-form-item label="名字">
        <span>{{ complexs.firstName }}</span>
      </el-form-item>
      <el-form-item label="姓氏">
        <span>{{ complexs.lastName }}</span>
      </el-form-item>
      <el-form-item label="邮箱">
        <span>{{ complexs.email }}</span>
      </el-form-item>
      <el-form-item label="语言">
        <span>{{ complexs.langKey }}</span>
      </el-form-item>
      <el-form-item label="创建人">
        <span>{{ complexs.createdBy }}</span>
      </el-form-item>
      <el-form-item label="创建时间">
        <span>{{ complexs.createdDate | formatDate }}</span>
      </el-form-item>
      <el-form-item label="最近修改人">
        <span>{{ complexs.lastModifiedBy }}</span>
      </el-form-item>
      <el-form-item label="最近修改时间">
        <span>{{ complexs.lastModifiedDate | formatDate }}</span>
      </el-form-item>
      <el-form-item label="角色">
        <span>{{ complexs.authority }}</span>
      </el-form-item>
    </el-form>
    <el-button
      type="primary"
      @click="goBack"
    >
      返回
    </el-button>
  </div>
</template>
<script>
  import { search } from '../../api/ManagementService'
  export default {
    name: 'managementDetail',
    data() {
      return {
        complex: null,
        complexs: []
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        this.complex = this.$route.params && this.$route.params.id
        console.log(this.$route)
        this.findComplex(this.complex)
      },
      findComplex(a) {
        search(a).then(res => {
          this.complexs = res.data
        })
      },
      goBack() {
        this.$router.push({
          path: 'management'
        })
      }
    }
  }

</script>
<style lang="scss">
  h2{
    padding-left: 50px;
  }
  .el-form--inline .el-form-item{
    width: 100%;
    border-bottom: 1px solid #eeeeee;
  }
  .el-form-item--medium .el-form-item__label{
    margin-left: 50px;
    width: 170px;
    text-align: right
  }
</style>
