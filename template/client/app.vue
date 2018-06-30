<template>
    <!-- 增加keep-alive 在不需要的缓存页面的组件 显示声明名称name 并且后缀后NoCache -->
    <div>
       <div class="text-center"><img src='./assets/images/logo.png'></div>
      <keep-alive :exclude="/NoCache$/"><router-view/></keep-alive>
    </div>
</template>

<script>
export default {

}
</script>

<style scoped>
img {
  height: 400px;
}
</style>

