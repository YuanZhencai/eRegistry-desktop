// import { buldeGetPath } from './plan.js'
// data 請求的參數，path get請求的路徑, filterData 不進入請求的參數
const buldeGetPath = (data, path, filterData) => {
  // 獲取 有值的參數，過濾掉沒有值的參數
  const haveKeys = Object.keys(data).filter(i => {
    return data[i] && i !== filterData
  })

  let newPath = path
  haveKeys.forEach((i, index) => {
    if (index === 0) {
      newPath += ('?' + i + '=' + data[i])
    } else {
      newPath += ('&' + i + '=' + data[i])
    }
  })

  return newPath
}
export const calendarApi = {
  getCalendar: (data) => buldeGetPath(data, 'api/follows/events/' + data.id)
}
