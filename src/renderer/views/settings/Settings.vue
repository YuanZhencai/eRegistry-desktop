<template>
  <div class="login-container">
    <el-row :gutter="20">
      <el-col :span="12"
              :offset="6">
        <div class="text-center">
          <h2>
            用户设置
          </h2>
        </div>
        <el-card class="box-card">
          <div slot="header"
               class="clearfix">
            <span>个人信息</span>
          </div>
          <div>

          </div>
        </el-card>
        <el-card>
          <div slot="header"
               class="clearfix">
            <span></span>
            <div>
              <el-form :label-position="labelPosition"
                       label-width="80px"
                       :model="formLabelAlign">
                <el-upload class="avatar-uploader"
                           action="https://jsonplaceholder.typicode.com/posts/"
                           :show-file-list="false"
                           :on-success="handleAvatarSuccess"
                           :before-upload="beforeAvatarUpload">
                  <img v-if="imageUrl"
                       :src="imageUrl"
                       class="avatar">
                  <i v-else
                     class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <el-form-item label="名字">
                  <el-input v-model="formLabelAlign.name"></el-input>
                </el-form-item>
                <el-form-item label="姓氏">
                  <el-input v-model="formLabelAlign.region"></el-input>
                </el-form-item>
                <el-form-item label="电子邮件">
                  <el-input v-model="formLabelAlign.type"></el-input>
                </el-form-item>
                <el-button type="primary"
                           @click="save()">主要按钮</el-button>
              </el-form>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>
<script>
export default {
  data() {
    return {
      imageUrl: '',
      labelPosition: 'right',
      formLabelAlign: {
        name: '',
        region: '',
        type: ''
      }
    }
  },
  methods: {
    save() {
      console.log('s')
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>
<style scope>
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>