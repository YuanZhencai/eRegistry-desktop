import axios from 'axios'

export function getArticles(params) {
  return axios.get(`api/articles`, { params: params })
}

export function getArticle(articleId) {
  return axios.get(`api/articles/${articleId}`)
}

export function saveArticle(article) {
  return axios.put(`api/articles`, article)
}
