import { dialog, shell } from 'electron'
import axios from 'axios'
import pkg from '../../package.json'
const yaml = require('js-yaml')
const version = pkg.version
const latest = {
  darwin: 'latest-mac.yml',
  win32: 'latest.yml',
  linux: 'latest-linux.yml'
}
const release = `${process.env.BASE_API}download/${latest[require('os').platform()]}`
console.info(version, release)
const checkVersion = async(win) => {
  // 自动更新的弹窗如果用户没有设置不再提醒，就可以去查询是否需要更新
  try {
    const res = await axios.get(release)
    if (res.status === 200) {
      const data = yaml.safeLoad(res.data, { json: true })
      console.info('data', data)
      const latest = data.version // 获取版本号
      const downloadUrl = `${process.env.BASE_API}download/${data.path}`
      const result = compareVersion2Update(version, latest) // 比对版本号，如果本地版本低于远端则更新
      if (result) {
        dialog.showMessageBox(win, {
          type: 'info',
          title: '发现新版本',
          buttons: ['是', '否'],
          message: '发现新版本，更新了很多功能，是否去下载最新的版本？'
        }, (res) => {
          if (res === 0) { // if selected yes
            shell.openExternal(downloadUrl)
          }
        })
      }
    } else {
      return false
    }
  } catch (e) {
    // ignore
  }
  return false
}

// if true -> update else return false
const compareVersion2Update = (current, latest) => {
  let flag = false

  try {
    console.info('当前版本:' + current + ' 最新版本:' + latest)
    const currentVersion = getVersionValue(current)
    const latestVersion = getVersionValue(latest)
    flag = currentVersion < latestVersion
    console.info('当前版本:' + currentVersion + ' 最新版本:' + latestVersion)
  } catch (e) {
    console.info('版本比较失败')
  }

  return flag
}

const getVersionValue = (version) => {
  const numbers = version.split('.').map(item => parseInt(item))
  const value = numbers[0] * 10000 + numbers[1] * 100 + numbers[2]
  return value
}

export default checkVersion
