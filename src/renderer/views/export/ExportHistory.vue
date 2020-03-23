<template>
    <el-popover
            @show="findExportFiles"
            placement="bottom"
            width="300"
            trigger="click">
        <div class="clearfix">
            <span>导出列表</span>
            <a style="float: right; padding: 3px 0" type="text" @click="clear">清除记录</a>
        </div>
        <el-divider></el-divider>
        <div v-if="files.length === 0">
            <div>暂无记录</div>
            <div>导出的记录会在这边显示</div>
        </div>
        <div v-if="files.length > 0" v-for="(file, index) in files" :key="index">
            <a href="#" class="list-group-item" @click="revealInFinder(file)">
                <h4 class="list-group-item-heading">{{file.name}}</h4>
                <p class="list-group-item-text">{{file.length}} {{file.type}}</p>
            </a>
        </div>
        <i slot="reference" class="fa fa-cloud-download" aria-hidden="true"></i>
    </el-popover>
</template>

<script>
    import { ipcRenderer, shell } from 'electron'
    import { addExportFile, clearExportFiles, findExportFiles } from '../../api/ExportService'

    export default {
      name: 'ExportHistory',
      data() {
        return {
          files: []
        }
      },
      mounted() {
        this.onDownloadFinish()
        this.findExportFiles()
      },
      methods: {
        onDownloadFinish() {
          ipcRenderer.on('download-finish', async(event, file) => {
            let message

            if (file.state === 'success') {
              message = {
                title: '成功',
                type: 'success',
                message: `${file.name} 导出成功`
              }
            } else {
              message = {
                title: '失败',
                type: 'success',
                message: `${file.name} 导出失败`
              }
            }
            this.$notify(message)
            addExportFile(file)
            this.findExportFiles()
          })
        },
        findExportFiles() {
          this.files = findExportFiles()
        },
        clear() {
          clearExportFiles()
          this.findExportFiles()
        },
        revealInFinder(file) {
          shell.showItemInFolder(file.path)
        }
      }
    }
</script>

<style scoped>

</style>