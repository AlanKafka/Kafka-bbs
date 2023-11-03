<template>
  <el-card class="card-grid" shadow="always" v-for="(p) in hotText" :key="p.articleId">
    <div style="float: left;width: 70%;top:-30px;">
      <div class="common-layout">
        <el-container>
          <el-aside width="50px">
            <img class="img-head" :src="p.user.userAvatar">
          </el-aside>
          <el-main> 
            <span style="font-size: 12px;color: dimgrey;font-weight: bold">
              {{ p.userName }}  
            </span>
            <span></span>
            <span style="font-size: 11px;color: dimgrey;font-weight: bold">&nbsp;&nbsp;{{ p.postTime }}</span>
            <span
                style="font-size: 12px;color: dimgrey;margin-left: 6px;font-weight: bold">{{ labelDetail(p.label) }}</span>
          </el-main>
        </el-container>
      </div>
      <h4 id="title" style="color: #252933">
        <router-link style="color:#000;" :to="{
              path:'/article',
              query:{
                id:p.articleId
              }
            }">{{ p.title }}
        </router-link>
      </h4>

      <p class="p-hidden" style="font-size: 12px">{{ p.summary }}</p>
      <el-icon style="margin-right: 5px">
        <View/>
      </el-icon>
      <span style="margin-right: 10px;color:#8A919F;font-size: 14px">{{ p.readCount }}</span>

      <el-icon style="margin-right: 5px">
        <Star/>
      </el-icon>
      <span style="margin-right: 10px;color:#8A919F;font-size: 14px;">{{ p.goodCount }}</span>
    </div>


    <div class="div-img-banner">
      <img class="img-banner" :src="p.cover">
    </div>
  </el-card>
</template>

<script setup lang="ts">
import instance from "../axios/myAxios.js";
import {useRoute, useRouter} from "vue-router";
import {onMounted, reactive, ref} from "vue";
import {ElMessage} from 'element-plus'

const router = useRouter();
const route = useRoute();
/** 主页请求数据 **/
onMounted(() => {
  hotHomeData();
})
let hotText = reactive(
    []
)

let texts = reactive([])

async function hotHomeData() {
  await instance.get('/backend/hot').then(res => {

    if (res.code == 200) {
      texts = res.data;
      texts.forEach(item => {
        item.user.userAvatar = 'http://localhost:8081/' + item.user.userAvatar.slice(3);
        item.cover = 'http://localhost:8081/'+item.cover.slice(3);
        hotText.push(item)
      })
    }
  }).catch(error => {
    ElMessage.error('页面加载失败.');
  })
}

/** 标签 **/
function labelDetail(value) {
  if (value == -1) {
    return "其他"
  }
  if (value == 0) {
    return "前端"
  }
  if (value == 1) {
    return "后端"
  }
}
</script>

<style scoped>
.img-head {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

#title {
  color: black;
  margin: 0px 0px 0px 0px;
  padding: 0px 0px 0px 0px;
  font-weight: bold;
}

/*卡片的样式*/
.card-grid {
  width: 100%;
  height: 165px;
  text-align: left;
  align-items: center;
  padding-top: 8px;
}

.div-img-banner {
  float: right;
  margin-top: 10px;

}

.img-banner {
  height: 120px;
  width: 200px;
  float: right;

}

/*设置内容的显示*/
.p-hidden {
  width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 路由跳转 */
#title :hover {
  border-bottom: 1px solid #000000;

}
</style>