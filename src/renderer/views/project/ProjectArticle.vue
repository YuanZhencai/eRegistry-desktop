<template>
	<div>
		<el-row v-if="$hasAnyAuthority(['PROJECT_ADMIN_' + projectId, 'PROJECT_MASTER_' + projectId])">
			<el-col :span='24'>
				<el-button type='primary' size="mini" class='float-right' @click="newArticle()">创建文章</el-button>
			</el-col>
		</el-row>
		<el-row>
			<el-table v-loading="loading" stripe :data='articles' style='width: 100%'>
				<el-table-column prop='title' label='标题' :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop='author' label='作者'></el-table-column>
				<el-table-column prop='summary' label='摘要' :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop='cover' label='封面'>
					<template slot-scope="scope">
						<el-image
								style="width: 85px; height: 85px"
								:src="`${SERVER_API_URL}api/articles/${scope.row.id}/cover.png?access_token=${token}`"
						></el-image>
					</template>
				</el-table-column>
				<el-table-column label='状态'>
					<template slot-scope="scope">
						<span :class="scope.row.state">{{ states[scope.row.state]}}</span>
					</template>
				</el-table-column>
				<el-table-column label='更新时间'>
					<template slot-scope="scope">{{scope.row.lastModifiedDate | formatDate('YYYY-MM-DD HH:mm')}}
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope"
							  v-if="$hasAnyAuthority(['PROJECT_ADMIN_' + projectId, 'PROJECT_MASTER_' + projectId])">
						<el-button type="text" @click="editArticle(scope.row)">编辑</el-button>
						<el-divider direction="vertical"></el-divider>
						<el-button type="text" @click="deleteArticle(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-row>
		<el-row>
			<el-pagination background layout="total, prev, pager, next, jumper"
						   :total="total" :page-size="pageSize" :current-page="currentPage"
						   @current-change="currentChange" class="pagination">
			</el-pagination>
		</el-row>
	</div>
</template>

<script>
	import { deleteArticle, getArticles } from '../../api/ArticleService'
	import { SERVER_API_URL } from '../../constants'
	import store from '../../store'

	export default {
	  name: 'ProjectArticle',
	  components: {},
	  data() {
	    const projectId = this.$route.params.projectId
	    const token = store.getters.token
	    return {
	      loading: false,
	      predicate: 'createdDate',
	      order: 'descending',
	      articles: [],
	      total: 0,
	      pageSize: 5, // 单页数据量
	      currentPage: 1, // 默认开始页面
	      deleteCenterDialogVisible: false,
	      selectedCenter: {},
	      projectId,
	      isSaving: false,
	      SERVER_API_URL: SERVER_API_URL,
	      token: token,
	      states: {
	        'SAVED': '已保存',
	        'PUBLISHED': '已发布',
	        'WITHDRAWN': '已撤回'
	      }
	    }
	  },
	  created() {
	    this.getArticles()
	  },
	  methods: {
	    sort() {
	      return (this.predicate && this.order) ? this.predicate + ',' + (this.order === 'ascending' ? 'asc' : 'desc') : null
	    },
	    changeOrder(sort) {
	      this.predicate = sort.prop
	      this.order = sort.order
	      this.getArticles()
	    },
	    getArticles() {
	      this.loading = true
	      getArticles({
	        'EQ_article.projectId': this.projectId,
	        page: this.currentPage - 1,
	        size: this.pageSize,
	        sort: this.sort()
	      }).then(response => {
	        this.loading = false
	        this.articles = response.data
	        this.total = Number(response.headers['x-total-count'])
	      })
	    },
	    currentChange: function(currentPage) {
	      this.currentPage = currentPage
	      this.getArticles()
	    },
	    newArticle() {
	      this.$router.push({
	        path: `/project/${this.projectId}/article-new`
	      })
	    },
	    editArticle(article) {
	      this.$router.push({
	        path: `/project/${this.projectId}/article/${article.id}`
	      })
	    },
	    deleteArticle(article) {
	      this.$confirm('确认要删除文章吗？', '提示', {
	        confirmButtonText: '确定',
	        cancelButtonText: '取消',
	        type: 'error'
	      }).then(() => {
	        deleteArticle(article.id).then(() => {
	          this.getArticles()
	        })
	      }).catch(() => {
	      })
	    }
	  }
	}
</script>

<style scoped>
	.SAVED {
		color: #909399;
	}

	.PUBLISHED {
		color: #67C23A;
	}

	.WITHDRAWN {
		color: #F56C6C;
	}
</style>
