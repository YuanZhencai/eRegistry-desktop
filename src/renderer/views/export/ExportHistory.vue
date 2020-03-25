import {app} from "electron";
<template>
  <el-popover @show="findExportFiles"
              placement="bottom"
              width="251"
              trigger="click">
    <div class="clearfix">
      <h5>导出列表</h5>
      <h6 @click="clear">清除记录</h6>
    </div>
    <div v-if="files.length === 0"
         class="column">
      <div>暂无记录</div>
      <div>导出的记录会在这边显示</div>
    </div>
    <div v-if="files.length > 0"
         v-for="(file, index) in files"
         :key="index">
      <div class="list-group-title" @click="revealInFinder(file)">
        <div style="width: 170px;float: left">
          <file-icon :filename="file.path"></file-icon>

          <p class="list-group-item-shared list-group-item-heading">{{file.name}}</p>
          <p class="list-group-item-shared list-group-item-text">
            <i class="el-icon-download"></i>
            <span v-if="file.stats">{{file.stats.size | bytes}}</span>
            <span v-if="file.path">{{file.path | extension}}</span>
          </p>
        </div>
        <el-popover placement="bottom"
                    width="150"
                    v-model="file.visible"
                    trigger="hover">
          <span slot="reference"
                class="ellipsis">···</span>
          <div class="operation">
            <p class="openFile font-size"
               @click="revealInFinder(file)">打开文件夹</p>
            <p class="deleteLog font-size" @click="remove(index, file)" >删除记录</p>
          </div>
        </el-popover>
      </div>
    </div>
    <i slot="reference"
       class="fa fa-cloud-download"
       aria-hidden="true"></i>
  </el-popover>
</template>

<script>
import { ipcRenderer, shell } from 'electron'
import { addExportFile, clearExportFiles, findExportFiles, saveExportFiles } from '../../api/ExportService'
import FileIcon from './file-icon'
const fs = require('fs')
export default {
  name: 'export-history',
  components: { FileIcon },
  data() {
    return {
      files: []
    }
  },
  created() {
    this.findExportFiles()
  },
  mounted() {
    this.onDownloadFinish()
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
      this.files.forEach((file) => {
        const exists = fs.existsSync(file.path)
        if (exists) {
          file.stats = fs.statSync(file.path)
        }
      })
    },
    clear() {
      clearExportFiles()
      this.findExportFiles()
    },
    revealInFinder(file) {
      file.visible = false
      fs.exists(file.path, (exists) => {
        if (exists) {
          shell.showItemInFolder(file.path)
        } else {
          this.$message.error('文件已经删除，请重新导出')
        }
      })
    },
    remove(index, file) {
      file.visible = false
      this.files.splice(index, 1)
      saveExportFiles(this.files)
    }
  }
}
</script>

<style scoped>
.clearfix {
  overflow: hidden;
  border-bottom: 1px solid #ebeef5;
}
.clearfix h5 {
  float: left;
}
.clearfix h6 {
  float: right;
  color: #409eff;
}
.column {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin: 20px;
  font-size: 15px;
}

.list-group-title {
  overflow: hidden;
  border-bottom: 1px solid #ddd;
  padding-top: 8px;
}
.list-group-title:hover {
  background: #f9fafc;
  cursor: pointer;
}

.list-group-title:hover .list-group-item-heading {
  color: #409eff;
}
.list-group-item-shared {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  padding: 0px !important;
  text-align: left !important;
}
.list-group-item-heading {
  font-size: 13px;
  color: #606266;
}
.list-group-item-text {
  color: #5e6d82;
  font-size: 10px;
}
.ellipsis {
  line-height: 40px;
  font-size: 20px;
}
.el-popover p {
  text-align: center;
  padding: 10px 0;
  margin: 0px;
}
.font-size{
  font-size: 13px;
}
.openFile:hover {
  background: #f9fafc;
  color: #409eff;
  cursor: pointer;
}
.deleteLog:hover {
  background: #f9fafc;
  color: #409eff;
  cursor: pointer;
}
</style>
