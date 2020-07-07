<template>
  <div class="app-container">
    <h3>用户管理</h3>
      <div class="filter-container">
        <el-input
          v-model="listQuery.login"
          placeholder="输入用户名称/邮箱搜索"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"/>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter">
          搜索
        </el-button>
        <el-button
          class="filter-item"
          style="margin-left: 10px;"
          type="primary"
          icon="el-icon-edit"
          @click="handleCreate">
            添加用户
        </el-button>
      </div>
      <el-table
        :data="complexs"
        @sort-change="changeOrder"
        border
        fit
        highlight-current-row
        style="width: 100%;">
          <el-table-column
            label="用户名"
            sortable="custom"
            align="center"
            width="280"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.login }}</span>
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
              <el-tag
                v-if="row.authorities[0]"
                type="success"
                size="mini">
                {{ row.authorities[0] }}
              </el-tag>
                <el-tag
                  v-if="row.authorities[1]"
                  type="success"
                  size="mini">
                  {{ row.authorities[1] }}
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
            width="420"
            class-name="fixed-width">
            <template slot-scope="{row}">
              <!-- 编辑 -->
              <el-button
                type="primary"
                size="mini"
                @click="handleUpdate(row)"
              >
                编辑
              </el-button>
              <!-- 删除 -->
              <el-button
                size="mini"
                type="danger"
                @click="userManagementDelete(row)"
              >
                删除
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
    <el-pagination @size-change="sizeChange"
                   @current-change="currentChange"
                   :current-page="listQuery.page+1"
                   :page-size="listQuery.size"
                   layout="total, prev, pager, next, jumper"
                   :total="total"
                   background
                   class="pagination">
    </el-pagination>
      <el-dialog
        title="修改密码"
        :visible.sync="dialogChangePassword">
        <el-form
          ref="defaultArticleData"
          :model="defaultArticleData"
          :rules="loginRules"
          autocomplete="on">
          <el-form-item
            label="用户名"
            prop="login">
            <el-input
              v-model="defaultArticleData.login"
              :disabled="true"/>
          </el-form-item>
          <el-form-item
            label="邮箱"
            prop="email">
            <el-input
              v-model="defaultArticleData.email"
              :disabled="true"/>
          </el-form-item>
          <el-form-item
            prop="password"
            label="密码">
              <el-input
                :key="passwordType"
                ref="password"
                v-model="defaultArticleData.password"
                :type="passwordType"
                name="password"
                autocomplete="on"
                @keyup.enter.native="newPasswordData"/>
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer">
            <el-button @click="dialogChangePassword = false">
              取 消
            </el-button>
            <el-button
                    type="primary"
                    @click="newPasswordData('newPassWord')">
              确 定
            </el-button>
        </div>
      </el-dialog>
      <el-dialog
        :title="textMap[dialogStatus]"
        :visible.sync="dialogFormVisible">
          <el-form
            ref="dataForm"
            :rules="rules"
            :model="defaultArticleData"
            label-position="left"
            label-width="100px"
            style="width: 400px; margin-left:50px;"
          >
            <el-form-item
              label="用户名"
              prop="login"
            >
              <el-input v-model="defaultArticleData.login" />
            </el-form-item>
            <el-form-item
              prop="email"
              label="邮箱"
              :rules="[
                {required: true, message: '请输入邮箱地址', trigger: 'blur'},
                {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
              ]"
            >
              <el-input v-model="defaultArticleData.email" />
            </el-form-item>
            <el-form-item
              label="激活"
              required
            >
              <el-checkbox v-model="showReviewer"/>
            </el-form-item>
            <el-form-item
              label="权限"
              prop="authorities"
            >
              <el-checkbox-group v-model="defaultArticleData.authorities">
                <el-checkbox label="ROLE_USER" />
                <el-checkbox label="ROLE_ADMIN" />
              </el-checkbox-group>
            </el-form-item>
          </el-form>
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="dialogFormVisible = false">
              取消
            </el-button>
            <el-button
              type="primary"
              :disabled="disableds"
              @click="dialogStatus==='create'?createData():updateData()"
            >
              确定
            </el-button>
          </div>
      </el-dialog>
  </div>
</template>

<script>
  import { getInit, create, update, remove, modify } from '../../api/ManagementService'
  export default {
    name: 'management',
    data() {
      return {
        defaultArticleData: {
          activated: true,
          authorities: [],
          createdBy: null,
          createdDate: null,
          email: null,
          firstName: null,
          id: null,
          imageUrl: null,
          langKey: null,
          lastModifiedBy: null,
          lastModifiedDate: null,
          lastName: null,
          login: null,
          password: null
        },
        total: 0,
        listQuery: {
          page: 0,
          size: 10,
          login: undefined
        },
        tempArticleData: [],
        complexs: [],
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
        },
        rules: {
          login: [{ required: true, message: '本字段不能为空', trigger: 'blur' }]
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      sort() {
        return (this.predicate && this.order) ? this.sortPropMap[this.predicate] + ',' + (this.order === 'ascending' ? 'asc' : 'desc') : null
      },
      changeOrder(sort) {
        this.predicate = sort.prop
        this.order = sort.order
        this.getList()
      },
      sizeChange(size) {
        this.listQuery.size = size
        this.getList()
      },
      currentChange(page) {
        this.listQuery.page = page - 1
        this.getList()
      },
      getList() {
        const req = {
          page: this.listQuery.page - 1,
          size: this.listQuery.limit,
          sort: this.sort()
        }
        if (this.listQuery.login && this.listQuery.login !== '') {
          req['LIKE_user.login'] = `%${this.listQuery.login}%`
        }
        getInit(req)
          .then(res => {
            this.total = Number(res.headers['x-total-count'])
            this.complexs = res.data
          }, () => {
          })
      },
      handleFilter() {
        this.getList()
      },
      handleCreate() {
        this.defaultArticleData = []
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
      },
      handleUpdate(row) {
        this.defaultArticleData = Object.assign({}, row)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      // 新建确认
      createData() {
        (this.$refs['dataForm']).validate(async(valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.defaultArticleData)
            create(tempData)
              .then(res => {
                this.complexs = res.data
                this.getList()
                this.$notify({
                  title: '成功',
                  message: '新建成功',
                  type: 'success',
                  duration: 2000
                })
              }, () => {
                this.$notify({
                  title: '失败',
                  message: '用户名或邮箱重复',
                  type: 'error',
                  duration: 2000
                })
              })
            this.dialogFormVisible = false
          }
        })
      },
      // 编辑确认
      updateData() {
        (this.$refs['dataForm']).validate(async(valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.defaultArticleData)
            update(tempData)
              .then(res => {
                this.dialogFormVisible = false
                this.getList()
                this.$notify({
                  title: '成功',
                  message: '更新成功',
                  type: 'success',
                  duration: 2000
                })
              })
          }
        })
      },
      published(row) {
        this.$store.commit('setRow', row)
        this.$router.push({
          name: 'management-detail'
        })
        row.status = status
      },
      // 修改状态
      setActive(row, activated) {
        row.activated = activated
        update(row)
          .then(res => {
            console.log(res)
            this.complexs = res.data
            this.getList()
          })
      },
      changePassword(row) {
        this.dialogChangePassword = true
        this.defaultArticleData = Object.assign({}, row)
      },
      newPasswordData(defaultArticleData) {
        this.$refs[defaultArticleData].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.defaultArticleData)
            modify({
              activated: tempData.activated,
              authorities: tempData.authorities,
              createdBy: tempData.createdBy,
              createdDate: tempData.createdDate,
              email: tempData.email,
              id: tempData.id,
              langKey: tempData.langKey,
              lastModifiedBy: tempData.lastModifiedBy,
              lastModifiedDate: tempData.lastModifiedDate,
              login: tempData.login,
              password: tempData.password
            })
              .then(res => {
                this.$notify({
                  title: '成功',
                  message: '密码修改成功',
                  type: 'success',
                  duration: 2000
                })
                this.dialogChangePassword = false
              })
          }
        })
      },
      userManagementDelete(row) {
        this.$confirm('你确定要删除用户' + row.login + '?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          remove(row.login)
            .then(() => {
              this.getList()
            })
        })
      }
    }
  }
</script>

<style scoped>

</style>
