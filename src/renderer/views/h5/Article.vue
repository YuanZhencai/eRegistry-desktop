<template>
	<div class="article-page">
		<div class="rich_media_area_primary">
			<div class="article-title">{{article.title}}</div>
			<div class="article-author">
				<span class="author">{{article.author}}</span>
				<span class="author">{{article.lastModifiedDate | formatDate('YYYY-MM-DD')}}</span>
			</div>
			<div class="article-content" v-html="article.content"/>
		</div>
	</div>
</template>

<script>
	import { getArticle } from '../../api/ArticleService'

	export default {
	  name: 'Article',
	  components: {},
	  data() {
	    const articleId = this.$route.params.articleId
	    return {
	      articleId: articleId,
	      article: {
	        content: null
	      }
	    }
	  },
	  created() {
	    this.getArticle()
	  },
	  methods: {
	    getArticle() {
	      if (this.articleId) {
	        getArticle(this.articleId).then((res) => {
	          this.article = res.data
	        })
	      }
	    }
	  }
	}
</script>
<style scoped>
	.article-page {
		padding: 20px;
	}
	.rich_media_area_primary {
		max-width: 677px;
		margin: auto;
	}
	.article-title {
		font-size: 22px;
		line-height: 1.4;
		margin-bottom: 14px;
	}
	.article-author {
		margin-bottom: 22px;
		line-height: 20px;
		font-size: 0;
	}
	.author {
		display: inline-block;
		vertical-align: middle;
		margin: 0 10px 10px 0;
		font-size: 15px;
		-webkit-tap-highlight-color: rgba(0,0,0,0);
	}
	.article-content {
		font-size: 0;
		margin: 0 0 16px;
		padding: 12px 16px;
		border-radius: 8px;
	}
</style>
