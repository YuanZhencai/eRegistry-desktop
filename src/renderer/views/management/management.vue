<template>
	<div class="app-container">
		<h3>用户管理</h3>
		<div class="filter-container">
			<el-input
					v-model="login"
					placeholder="输入用户名称/邮箱搜索"
					style="width: 200px;"
					class="filter-item"/>
			<el-button
					class="filter-item"
					type="primary"
					icon="el-icon-search"
					@click="transition">
				搜索
			</el-button>
			<el-button
					class="filter-item"
					style="margin-left: 10px;"
					type="primary"
					icon="el-icon-edit"
					@click="newUser">
				添加用户
			</el-button>
		</div>
		<el-table
				:data="users"
				@sort-change="changeOrder"
				border
				fit
				highlight-current-row
				style="width: 100%;">
			<el-table-column
					label="用户名"
					sortable="custom"
					align="center"
					width="200"
			>
				<template slot-scope="scope">
					<span>{{ scope.row.login }}</span>
				</template>
			</el-table-column>
      <el-table-column
        label="姓名"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
			<el-table-column
					label="邮箱"
					min-width="130px"
					align="center"
			>
				<template slot-scope="{row}">
					{{ row.email }}
				</template>
			</el-table-column>
			<el-table-column
					label="状态"
					class-name="status-col"
					width="140"
			>
				<template slot-scope="{row}">
              <span v-if="row.activated">
                <el-tag
						type=""
						effect="dark"
						@click="setActive(row,false)"
				>
                  Activated
                </el-tag>
              </span>
					<span v-else>
                <el-tag
						type="danger"
						effect="dark"
						@click="setActive(row,true)"
				>
                  Deactivated
                </el-tag>
              </span>
				</template>
			</el-table-column>
			<el-table-column
					label="角色"
					width="200px"
					align="center">
				<template slot-scope="{row}">
					<el-tag v-for="(authority, index) in row.authorities" :key="index"
							type="success"
							size="mini">
						{{ authority }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column
					label="创建时间"
					width="220px"
					align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.createdDate | formatDate('YYYY-MM-DD HH:mm:ss') }}</span>
				</template>
			</el-table-column>
			<el-table-column
					label="操作"
					align="center"
					width="320"
					class-name="fixed-width">
				<template v-if="row.login !== 'admin'" slot-scope="{row}">
					<!-- 编辑 -->
					<el-button
							type="primary"
							size="mini"
							@click="editUser(row)"
					>
						编辑
					</el-button>
					<!-- 修改 -->
					<el-button
							size="small"
							@click="changePassword(row)"
					>
						修改密码
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
				background
				@current-change="loadPage"
				:current-page="page"
				:page-size="size"
				layout="total, prev, pager, next, jumper"
				:total="totalItems" class="pagination">
		</el-pagination>
		<user-detail-dialog ref="user-dialog"></user-detail-dialog>
		<change-password-dialog ref="password-dialog"></change-password-dialog>
	</div>
</template>

<script>
	import { findUsers, updateUser } from '../../api/ManagementService'
	import UserDetailDialog from './user-detail-dialog'
	import ChangePasswordDialog from './change-password-dialog'

	export default {
	  name: 'management',
	  components: {
	    ChangePasswordDialog,
	    UserDetailDialog
	  },
	  data() {
	    return {
	      user: {},
	      total: 0,
	      login: null,
	      page: 1,
	      previousPage: 1,
	      size: 10,
	      predicate: 'createdDate',
	      order: 'ascending',
	      totalItems: null,
	      queryCount: null,
	      filter: {},
	      users: [],
	      tempArticleData: [],
	      showReviewer: true,
	      disableds: false,
	      passwordType: 'password',
	      statusOptions: ['published', 'draft', 'deleted'],
	      dialogFormVisible: false,
	      dialogChangePassword: false,
	      dialogStatus: '',
	      textMap: {
	        update: '编辑用户信息',
	        create: '创建新用户'
	      },
	      dialogPageviewsVisible: false,
	      downloadLoading: false,
	      loginRules: {
	        password: [
	          { required: true, message: '密码不能为空!', trigger: 'blur' },
	          { min: 6, message: '密码长度至少6位!', trigger: 'blur' }
	        ]
	      }
	    }
	  },
	  created() {
	    this.loadAll()
	  },
	  methods: {
	    sort() {
	      return (this.predicate && this.order) ? this.predicate + ',' + (this.order === 'ascending' ? 'asc' : 'desc') : null
	    },
	    loadAll() {
	      this.loading = true
	      this.users = []
	      const sort = this.sort()
	      findUsers(Object.assign({
	        page: this.page - 1,
	        size: this.size,
	        sort
	      }, this.query())
	      ).then((res) => {
	        this.users = res.data
	        this.totalItems = Number(res.headers['x-total-count'])
	        this.queryCount = this.totalItems
	        this.loading = false
	      })
	    },
	    transition() {
	      this.loadAll()
	    },
	    loadPage(page) {
	      if (page !== this.previousPage) {
	        this.previousPage = page
	        this.page = page
	        this.transition()
	      }
	    },
	    changeOrder(sort) {
	      this.predicate = sort.prop
	      this.order = sort.order
	      this.transition()
	    },
	    query() {
	      this.filter = {
	        'LIKE_user.login': this.login ? `%${this.login}%` : null
	      }
	      return this.filter
	    },
	    newUser() {
	      const user = {
	        id: null,
	        authorities: [],
	        activated: true
	      }
	      this.$refs['user-dialog'].show(user).then(() => {
	        this.loadAll()
	      }, () => {
	      })
	    },
	    editUser(user) {
	      this.$refs['user-dialog'].show(user).then(() => {
	        this.loadAll()
	      }, () => {
	      })
	    },
	    // 修改状态
	    setActive(row, activated) {
	      const copy = JSON.parse(JSON.stringify(row))
	      copy.activated = activated
	      updateUser(copy)
	        .then(res => {
	          console.log(res)
	          this.complexs = res.data
	          this.loadAll()
	        })
	    },
	    changePassword(user) {
	      this.$refs['password-dialog'].show(user).then(() => {
	      }, () => {
	        this.loadAll()
	      })
	    }
	  }
	}
</script>

<style scoped>

</style>
