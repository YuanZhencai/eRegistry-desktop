import Vue from 'vue'
import axios from 'axios'
import { saveAs } from 'file-saver'
import { Notification } from 'element-ui'
var electron
if (!process.env.IS_WEB) {
  electron = require('electron')
}

export function initDirectives() {
  Vue.directive('download', {
    bind: function(el, binding, vnode, oldVnode) {
      el.addEventListener('click', function() {
        const params = binding.value
        const directory = 'downloads'
        if (!process.env.IS_WEB) {
          electron.ipcRenderer.send('download-item', {
            url: `${process.env.BASE_API}${params.url}`,
            directory: directory,
            filename: params.name
          })
        } else {
          el.disabled = true
          axios({
            method: 'get',
            url: params.url,
            responseType: 'blob'
          }).then(res => {
            const blob = new Blob([res.data])
            if (blob.size <= 0) {
              Notification({
                title: '失败',
                type: 'success',
                message: `${params.name} 导出失败`
              })
              return
            }
            const fileName = params.name || res.headers.get('filename') || res.headers.get('x-filename')
            saveAs(blob, decodeURI(fileName))
            Notification({
              title: '成功',
              type: 'success',
              message: `${fileName} 导出成功`
            })
            el.disabled = false
          }).catch(err => {
            console.log(err)
            el.disabled = false
          })
        }
      })
    }
  })
  Vue.directive('downloadWeb', {
    bind: function(el, binding, vnode, oldVnode) {
      el.addEventListener('click', function() {
        el.disabled = true
        const params = binding.value
        axios({
          method: 'get',
          url: params.url,
          responseType: 'blob'
        }).then(res => {
          const blob = new Blob([res.data])
          if (blob.size <= 0) {
            Notification({
              title: '失败',
              type: 'success',
              message: `${params.name} 导出失败`
            })
            return
          }
          const fileName = params.name || res.headers.get('filename') || res.headers.get('x-filename')
          saveAs(blob, decodeURI(fileName))
          Notification({
            title: '成功',
            type: 'success',
            message: `${fileName} 导出成功`
          })
          el.disabled = false
        }).catch(err => {
          console.log(err)
          el.disabled = false
        })
      })
    }
  })
}
