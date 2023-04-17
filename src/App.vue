<template>
  <div class="app">
    <div class="header">
      <div v-for="(i, k) in menus" :key="k" @click="clickMenu(i)">
        {{ i.name }}
      </div>
    </div>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import router from "./router";

const menus = ref([
  {
    name: "dino",
    path: "/dino",
  },
]);
const clickMenu = (item: { path: string; name: string }) => {
  router.push(item.path);
};
</script>

<style lang="less" scoped>
.app {
  // width: 100vw;
  // height: 100vh;
  // background: cadetblue;
}
.header {
  box-sizing: border-box;
  padding: 0px 10px;
  width: 100vw;
  height: 60px;
  box-shadow: 0px 0px 10px 0px rgba(189, 186, 186, 0.5);
  display: flex;
  align-items: center;
  background: #fff;
  position: fixed;
  div {
    width: 80px;
    text-align: center;
    cursor: pointer;
  }
}
.content {
  width: 100vw;
  padding-top: 60px;
  height: calc(100vh - 60px);
  overflow: hidden;
}
</style>
