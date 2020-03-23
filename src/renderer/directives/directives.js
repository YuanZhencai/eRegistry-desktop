import Vue from 'vue'
import { ipcRenderer } from 'electron'

export function initDirectives() {
  Vue.directive('download', {
    bind: function(el, binding, vnode, oldVnode) {
      el.addEventListener('click', function() {
        const params = binding.value
        const directory = 'downloads'
        ipcRenderer.send('download-item', {
          url: `${process.env.BASE_API}${params.url}`,
          directory: directory,
          filename: params.name
        })
      })
    }
  })
}
