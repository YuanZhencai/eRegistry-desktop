<template>
    <el-dialog title="创建或编辑分中心" :visible.sync="visible" :before-close="closeDialog">
        <el-form label-width="80px">
            <el-form-item label="名称">
                <el-input v-model="center.name"></el-input>
            </el-form-item>
            <el-form-item label="电话">
                <el-input v-model="center.telephone"></el-input>
            </el-form-item>
            <el-form-item label="编号">
                <el-input v-model="center.no"></el-input>
            </el-form-item>
            <el-form-item label="负责人">
                <el-input v-model="center.chargedBy"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
                <el-input v-model="center.email"></el-input>
            </el-form-item>
            <el-form-item label="邮编">
                <el-input v-model="center.zipCode"></el-input>
            </el-form-item>
            <el-form-item label="地址">
                <el-input v-model="center.address"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click="closeDialog">取 消</el-button>
            <el-button size="mini" type="primary" @click="closeDialog">保存</el-button>
        </div>
    </el-dialog>
</template>

<script>
  export default {
    name: 'CenterDialogComponent',
    props: {
      visible: {
        type: Boolean
      },
      center: {
        type: Object
      }
    },
    data() {
      return {}
    },
    methods: {
      closeDialog() {
        this.$emit('closeDialog', 'centerDialog')
      }
    }
  }
</script>

<style scoped>

</style>
