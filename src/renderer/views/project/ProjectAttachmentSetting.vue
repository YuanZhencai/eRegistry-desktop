<template>
	<div>
		<el-row v-if="$hasAnyAuthority(['PROJECT_ADMIN_' + projectId, 'PROJECT_MASTER_' + projectId])">
			<el-col :span='24'>
				<el-button type='primary'
						   class='float-right'
						   size="mini"
						   @click="newAttachmentSetting()">
					设置病例附件类型
				</el-button>
			</el-col>
		</el-row>
		<el-row>
			<el-table v-loading="loading"
					  stripe
					  :data='attachmentSettings'
					  @sort-change="changeOrder"
					  style='width: 100%'>

				<el-table-column prop='title'
								 label='名称'
								 sortable="custom">
				</el-table-column>
				<el-table-column prop='type'
								 label='类型'
								 sortable="custom">
					<template slot-scope="scope">
						{{typeMapping[scope.row.type]}}
					</template>
				</el-table-column>
				<el-table-column prop='lastModifiedBy' label='修改人' sortable="custom">
				</el-table-column>
				<el-table-column prop='lastModifiedDate' label='修改时间' sortable="custom">
					<template slot-scope="scope">
						{{scope.row.lastModifiedDate | formatDate('YYYY-MM-DD HH:mm:ss')}}
					</template>
				</el-table-column>

				<el-table-column label="操作"
								 v-if="$hasAnyAuthority(['PROJECT_ADMIN_' + projectId, 'PROJECT_MASTER_' + projectId])">
					<template slot-scope="scope">
						<el-button type="text"
								   @click="edit(scope.row)">编辑
						</el-button>
						<el-button type="text"
								   @click="remove(scope.row)">删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-row>
		<el-row>
			<el-pagination background
						   layout="total, prev, pager, next, jumper"
						   :total="total"
						   :page-size="pageSize"
						   :current-page="currentPage"
						   @current-change="currentChange"
						   class="pagination">
			</el-pagination>
		</el-row>
		<attachment-setting-dialog ref="attachmentSettingDialog"></attachment-setting-dialog>

	</div>
</template>

<script>
	import AttachmentSettingDialog from './AttachmentSettingDialog'
	import { deleteAttachmentSetting, getAttachmentSettings } from '../../api/AttachmentService'

	export default {
	  components: { AttachmentSettingDialog },
	  data() {
	    const projectId = this.$route.params.projectId
	    return {
	      typeMapping: {
	        'PATIENT_CASE': '病例',
	        'PLAN': '随访'
	      },
	      loading: false,
	      isSaving: false,
	      predicate: '',
	      order: '',
	      attachmentSettings: [],
	      projectId,
	      total: 0,
	      pageSize: 10, // 单页数据量
	      currentPage: 1 // 默认开始页面
	    }
	  },
	  created() {
	    this.getAttachmentSettings()
	  },
	  methods: {
	    sort() {
	      return (this.predicate && this.order) ? this.predicate + ',' + (this.order === 'ascending' ? 'asc' : 'desc') : null
	    },
	    changeOrder(sort) {
	      this.predicate = sort.prop
	      this.order = sort.order
	      this.getAttachmentSettings()
	    },
	    getAttachmentSettings() {
	      this.loading = true
	      getAttachmentSettings({
	        'EQ_attachmentSetting.projectId': this.projectId,
	        page: this.currentPage - 1,
	        size: this.pageSize,
	        sort: this.sort()
	      }).then((res) => {
	        this.attachmentSettings = res.data
	        this.loading = false
	        this.total = Number(res.headers['x-total-count'])
	      })
	    },
	    currentChange: function(currentPage) {
	      this.currentPage = currentPage
	      this.getAttachmentSettings()
	    },
	    newAttachmentSetting() {
	      this.$refs['attachmentSettingDialog'].show().then((res) => {
	        this.getAttachmentSettings()
	      }, () => {
	      })
	    },
	    edit(setting) {
	      this.$refs['attachmentSettingDialog'].show(setting.id).then((res) => {
	        this.getAttachmentSettings()
	      }, () => {
	      })
	    },
	    remove(setting) {
	      this.$confirm('确认要删除？', '提示', {
	        confirmButtonText: '确定',
	        cancelButtonText: '取消',
	        type: 'warning'
	      }).then(() => {
	        deleteAttachmentSetting(setting.id)
	          .then(() => {
	            this.getAttachmentSettings()
	          })
	      }).catch(() => {

	      })
	    }
	  }
	}
</script>

<style scoped>
</style>

