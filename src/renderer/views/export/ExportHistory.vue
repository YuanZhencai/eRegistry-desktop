<template>
  <el-popover @show="findExportFiles"
              placement="bottom"
              width="300"
              trigger="click">
    <div class="clearfix">
      <h4>导出列表</h4>
      <h5 @click="clear">清除记录</h5>
    </div>
    <div v-if="files.length === 0" class="column">
      <div>暂无记录</div>
      <div>导出的记录会在这边显示</div>
    </div>
    <div v-if="files.length > 0"
         v-for="(file, index) in files"
         :key="index">
      <div class="list-group-item">
        <i class="fa fa-file-archive-o fa-2x iconZip" aria-hidden="true"></i>
        <div style="width: 190px;float: left">
          <p class="list-group-item-shared list-group-item-heading">{{file.name}}</p>
          <p class="list-group-item-shared list-group-item-text"><i class="el-icon-download"></i>318.5 KB ZIP压缩文件{{file.length}} {{file.type}} </p>
        </div>
        <el-popover
                placement="bottom"
                width="150"
                trigger="hover">
          <span slot="reference"class="ellipsis">···</span>
          <div class="operation">
            <p class="openFile" @click="revealInFinder(file)">打开文件夹</p>
            <p class="deleteLog">删除记录</p>
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
  .clearfix{
    overflow: hidden;
    border-bottom: 1px solid #EBEEF5;
  }
  .clearfix h4 {
    float: left;
  }
  .clearfix h5 {
    float: right;
    color: #409EFF;
  }
  .column{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin:20px;
    font-size: 15px;
  }
  .list-group-item{
    margin-top: 10px;
    overflow: hidden;
  }
  .list-group-item:hover{
    background: #f9fafc;
    cursor:pointer;
  }
  .iconZip{
    margin: 5px 7px 0 0;
    float: left
  }
  .list-group-item:hover p{
    color: #409EFF;
  }
  .list-group-item-shared{
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    padding: 0px!important;
    text-align: left!important;
  }
  .list-group-item-heading{
    font-size: 15px;
    color:#606266;
  }
  .list-group-item-text{
    color: #5e6d82;
    font-size: 11px;
  }
  .ellipsis{
    line-height: 40px;
    font-size: 20px;
  }
  .el-popover p{
    text-align: center;
    padding: 10px 0;
    margin: 0px;
  }
  .openFile:hover{
    background: #f9fafc;
    color: #409EFF;
    cursor:pointer;
  }
  .deleteLog:hover{
    background: #f9fafc;
    color: #409EFF;
    cursor:pointer;
  }
</style>
