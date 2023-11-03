<template>
  <div class="posts">
    <el-card class="box-card">
      <el-tabs
          v-model="activeName"
          class="demo-tabs"
          @tab-click="handleClick"

      >
        <el-tab-pane label="热度" name="hot">
          <OtherArticleHot/>
        </el-tab-pane>
        <el-tab-pane label="最新" name="newest">
          <OtherArticleNewest/>
        </el-tab-pane>
      </el-tabs>
    </el-card>

  </div>
</template>

<script lang="ts" setup>

import type {TabsPaneContext} from 'element-plus'
import {ref} from 'vue'
import OtherArticleNewest from "../pages/OtherArticleNewest.vue";
import OtherArticleHot from "../pages/OtherArticleHot.vue";



const activeName = ref('hot')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  
}
</script>

<style scoped>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.posts {
  top: 53px;
  position: absolute;
  margin-top: 5px;
  margin-left: 14%;
  width: 71%;
}
</style>