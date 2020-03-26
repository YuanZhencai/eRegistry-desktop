<template>
  <a-calendar @panelChange="panelChange"
              local="local"
              ref='calendar'>
    <ul class="events"
        slot="dateCellRender"
        slot-scope="value">
      <li v-for="(items,index) in getListData(value)"
          :key="index">
        <a-badge :status="items.state"
                 :text="items.text" />
      </li>
    </ul>
    <template slot="monthCellRender"
              slot-scope="value">
      <div v-for="(items,index) in getMonthData(value)"
           :key="index"
           class="notes-month">
        <a-badge :status="items.state"
                 :text="items.text" />
      </div>
    </template>
  </a-calendar>
</template>
<script>
import { getCalendar } from '@/api/CalendarService'
import moment from 'moment'
export default {
  data() {
    return {
      projectId: this.$route.params.projectId,
      format: 'yyyy-MM-dd',
      begin: '',
      end: '',
      calendarData: [],
      arrayObject: []
    }
  },
  mounted() {
    this.buildStartDate(moment({}).format('YYYY-MM'))
    this.getData()
  },
  methods: {

    /**
     * 计算构建 表格开始日期和结束日期
     * @params currentMon 当前的月份
     */
    buildStartDate(currentMon) {
      // 获取月份第一天
      const start = moment(currentMon)
      let langTime = 0

      // 判断这天是周几，如果不是周一，计算跟周一相差几天
      if (start.weekday() !== 0) {
        langTime = start.weekday()
      }

      // 根据当前日历面板显示格数 和 跟上一个周一的距离时间 计算开始日期和结束日期并格式化
      const begin = JSON.parse(JSON.stringify(start.subtract(langTime, 'days')))
      this.begin = moment(begin).format('YYYY-MM-DD')
      this.end = moment(begin).add(41, 'days').format('YYYY-MM-DD')
      this.format = 'yyyy-MM-dd'
    },

    /**
     * 构建年份的开始月份和结束月份
     * @currentYear 当前年份
     */
    buildStartMon(currentYear) {
      // 获取这一年的开始时间 并格式化
      this.begin = moment(currentYear).startOf('year').format('YYYY-MM-DD')
      // 获取这一年的结束时间 并格式化
      this.end = moment(currentYear).endOf('year').format('YYYY-MM-DD')
      // 改变format 的格式 以对应接口
      this.format = 'yyyy-M'
    },

    /**
     * 渲染日单元格
     * @params value 当前单元格数据
     */
    getListData(value) {
      return this.buildResultData(value, 'YYYY-MM-DD')
    },

    /**
     * 渲染月份单元格
     * @params value 当前面板数据
     */
    getMonthData(value) {
      return this.buildResultData(value, 'YYYY-M')
    },

    /**
     * 构建页面数据
     * @params value 当前单元格数据，format 数据followDate的格式
     */
    buildResultData(value, format) {
      const dataItem = this.calendarData.filter(i => {
        return value.format(format) === i.followDate
      })[0]
      const followEvents = dataItem ? dataItem.followEvents : []
      const returnData = followEvents.length ? followEvents.map(i => {
        return {
          state: i.state,
          text: `${i.name} (${i.plan})`
        }
      }) : []
      return returnData
    },
    /**
     * 面板条件切换
     * @params val 当前选择月份+日期， mode当前选的模式是月份还是年
     */
    panelChange(val, mode) {
      // 先判断是月份查询还是年份查询
      // 条件切换时先构建开始时间和结束时间
      if (mode === 'month') {
        this.buildStartDate(val.format('YYYY-MM'))
      } else {
        this.buildStartMon(val.format('YYYY'))
      }

      // 条件切换时请求随访数据
      this.getData()
    },

    /**
     * 获取随访数据
     */
    async getData() {
      const data = {
        id: this.$route.params.projectId,
        begin: this.begin,
        end: this.end,
        format: this.format,
        zoneId: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
      await getCalendar(data).then((res) => {
        this.calendarData = res.data
      })
    }

  }
}
</script>
<style scoped>
.events {
  list-style: none;
  margin: 0;
  padding: 0;
}
.events .ant-badge-status {
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  text-overflow: ellipsis;
  font-size: 12px;
}
.notes-month {
  text-align: left;
  font-size: 28px;
}
.notes-month section {
  font-size: 28px;
}
</style>
