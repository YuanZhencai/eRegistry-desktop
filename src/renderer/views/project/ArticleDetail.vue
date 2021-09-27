<template>
	<div>
		<el-form v-if="article" :model="article" :rules="rules" ref="form">
			<el-form-item label="标题" prop="title">
				<el-input v-model="article.title"></el-input>
			</el-form-item>
			<el-form-item label="作者" prop="author">
				<el-input v-model="article.author"></el-input>
			</el-form-item>
			<el-form-item label="正文" prop="content">
			</el-form-item>
			<el-form-item>
				<tinymce v-if="article" v-model="article.content" :height="500" @save="save"/>
			</el-form-item>
			<el-form-item label="文章和摘要" prop="cover">
			</el-form-item>
			<el-form-item>
				<el-row>
					<el-col :span="4">
						<div class="cover-uploader" @click="open">
							<img v-if="imageUrl" :src="imageUrl" class="cover">
							<i v-else class="el-icon-plus cover-uploader-icon"></i>
						</div>
					</el-col>
					<el-col :span="20">
						<el-input type="textarea"
								  :rows="9"
								  v-model="article.summary">
						</el-input>
					</el-col>
				</el-row>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" v-if="'PUBLISHED' !== article.state" @click="save('SAVED')">保存</el-button>
				<el-button type="success" @click="publish">保存并发布</el-button>
				<el-button type="danger" v-if="'PUBLISHED' === article.state" @click="withdraw">撤回</el-button>
			</el-form-item>
		</el-form>
		<image-cropper
				v-show="show"
				:noCircle="true"
				lang-type="zh"
				@crop-success="cropSuccess"
				@close="close"
		/>
	</div>
</template>

<script>
	import Tinymce from '@/components/Tinymce'
	import ImageCropper from '@/components/ImageCropper'
	import { getArticle, saveArticle } from '../../api/ArticleService'
	import { SERVER_API_URL } from '../../constants'
	import store from '../../store'

	export default {
	  name: 'ArticleDetail',
	  components: { Tinymce, ImageCropper },
	  data() {
	    const projectId = this.$route.params.projectId
	    const articleId = this.$route.params.articleId
	    return {
	      projectId: projectId,
	      articleId: articleId,
	      article: null,
	      rules: {},
	      imageUrl: '',
	      show: false
	    }
	  },
	  created() {
	    this.getArticle()
	    this.initRules()
	  },
	  mounted() {
	  },
	  methods: {
	    initRules() {
	      const checkCover = (rule, value, callback) => {
	        if (!this.article.cover) {
	          callback(new Error('请上传封面'))
	        } else {
	          callback()
	        }
	      }
	      this.rules = {
	        title: [
	          { required: true, message: '请输入名称', trigger: 'blur' },
	          { max: 100, message: '长度在 100 个字符', trigger: 'blur' }
	        ],
	        author: [
	          { max: 50, message: '长度在 50 个字符', trigger: 'blur' }
	        ],
	        summary: [
	          { max: 200, message: '长度在 200 个字符', trigger: 'blur' }
	        ],
	        content: [
	          { required: true, message: '请输入正文', trigger: 'blur' }
	        ],
	        cover: [
	          { validator: checkCover, trigger: 'blur' }
	        ]
	      }
	    },
	    getArticle() {
	      if (this.articleId) {
	        const token = store.getters.token
	        this.imageUrl = `${SERVER_API_URL}api/articles/${this.articleId}/cover.png?access_token=${token}`
	        getArticle(this.articleId).then((res) => {
	          this.article = res.data
	        })
	      } else {
	        this.article = {
	          projectId: this.projectId
	        }
	      }
	    },
	    open() {
	      this.show = true
	    },
	    close() {
	      this.show = false
	    },
	    cropSuccess(createImgUrl, mime) {
	      this.imageUrl = createImgUrl
	      const data = {
	        cover: createImgUrl.split(',')[1],
	        coverContentType: mime
	      }
	      this.article = Object.assign(this.article, data)
	    },
	    save(state) {
	      this.$refs['form'].validate((valid) => {
	        if (valid) {
	          this.article.state = state
	          saveArticle(this.article).then(() => {
	            this.$router.push({
	              path: `/project/${this.projectId}/article`
	            })
	          })
	        }
	      })
	    },
	    publish() {
	      this.$confirm('确认要发布文章吗？', '提示', {
	        confirmButtonText: '确定',
	        cancelButtonText: '取消',
	        type: 'warning'
	      }).then(() => {
	        this.save('PUBLISHED')
	      }).catch(() => {
	      })
	    },
	    withdraw() {
	      this.$confirm('确认要撤回文章吗？', '提示', {
	        confirmButtonText: '确定',
	        cancelButtonText: '取消',
	        type: 'error'
	      }).then(() => {
	        this.save('WITHDRAWN')
	      }).catch(() => {
	      })
	    }
	  }
	}
</script>
<style>

	.cover-uploader {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
		width: 174px;
		height: 174px;
	}

	.cover-uploader:hover {
		border-color: #409EFF;
	}

	.cover-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 174px;
		height: 174px;
		line-height: 174px;
		text-align: center;
	}

	.cover {
		width: 174px;
		height: 174px;
		display: block;
	}
</style>
