<template>
    <div class="card-title ng-star-inserted">
        <el-avatar :src="imgUrl" :size="size" :shape="shape"></el-avatar>
    </div>
</template>

<script>
  export default {
    name: 'userAvatar',
    props: ['username', 'size', 'shape'],
    data() {
      return {
        imgUrl: process.env.BASE_API + '/api/image/avatar/' + this.username + '.png'
      }
    }
  }
</script>

<style scoped>

</style>
