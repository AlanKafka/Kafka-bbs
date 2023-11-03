<template>
  <!--文章详情-->
  <div class="posts">
    <el-card>
      <div class="detail-container">
        <h2 class="title">标题:{{ articleText.title }}</h2>
        <div class="article-head">
          <div>
            <img class="article-img-head" :src="articleText.userAvatar">&nbsp;&nbsp
          </div>

          <div>
            <p class="article-name">
              {{ articleText.userName }}
            </p>
            <span class="article-time">{{ articleText.postTime }}</span>
            <el-icon style="color: #8A919F;margin-left: 8px;top:2px;margin-right:4px">
              <View />
            </el-icon>
            <span style="color: #8A919F;font-size: 15px">
              {{ articleText.readCount }}
            </span>
            
            <el-button link  @click="changeFlgGood">
              <el-icon  size="16" style="margin-left: 8px;margin-right:4px;top:-2px">
                <Star v-if="flgGood"/>
                <StarFilled v-if="!flgGood" />
              </el-icon>
            </el-button>
            <span style="color: #8A919F;font-size: 15px">
              {{ articleText.goodCount }}
            </span>
          </div>
          
        </div>
        <div class="detail" v-html="articleText.content">
        </div>
      </div>
      <!--文章详情--->
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import hljs from "highlight.js";
import 'highlight.js/styles/atom-one-dark.css' //样式
import {nextTick, onMounted, reactive,ref} from "vue";
import {ElMessage} from 'element-plus';
import instance from "../axios/myAxios.js";
import {useRoute, useRouter} from "vue-router";
import {Star} from "@element-plus/icons-vue";
const router = useRouter();
const route = useRoute();
/** 文章详情 **/

// //代码高亮
onMounted(() => {
  articleData();
  articleDataRead();
},)

/** 点赞触发事件 start **/
const flgGood = ref(true)
/** 点赞触发事件 end **/

const changeFlgGood = ()=>{
  if(flgGood.value == true){
    flgGood.value = false;
  }else{
    flgGood.value = true;
  }
}

function highlightCode() {
  nextTick(() => {
    let blocks = document.querySelectorAll("pre code")
    blocks.forEach(item => {
      hljs.highlightBlock(item);
    })
  })
}

/**文章详情**/

let articleText = reactive(
    {
      title: '',
      userName: '',
      postTime: null,
      readCount: null,
      content: '',
      userAvatar:'',
      goodCount:'',
    }
)

const articleDataRead = async ()=>{
  await instance.request({
    url:'/article/readCount',
    method:'get',
    params:{
      articleId:route.query.id
    }
  }).then(res => {
    if (res.code == 200) {
      console.log(res.data)
    }
  }).catch(error => {
    ElMessage.error('数据错误')
  })
}

const articleData = async () => {
  await instance.request({
    url:'/article',
    method:'get',
    params:{
      articleId:route.query.id
    }
  }).then(res => {
    if (res.code == 200) {
      articleText.title = res.data.title;
      articleText.userName = res.data.userName;
      let time = new Date(res.data.postTime).toJSON();
      articleText.postTime = new Date(+new Date(time) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
      articleText.readCount = res.data.readCount;
      articleText.content = res.data.content;
      articleText.userAvatar  = 'http://localhost:8081/'+res.data.user.userAvatar.slice(3);
      articleText.goodCount = res.data.goodCount;
      highlightCode();
    }
  }).catch(error => {
    ElMessage.error('数据错误')
  })
}

</script>

<style scoped>
/** 文章样式 ***/
.detail-container {
  padding-left: 0px;
  padding-right: 0px;
}

.title {
  font-size: 16px;
  font-weight: bolder;
}

.article-head {
  display: -webkit-flex;
  display: flex;
  border-bottom: 1px solid darkgray;
}

.article-name {
  font-size: 16px;
  
  margin-left: 10px;
  margin-top: 0px;
  margin-bottom: 4px;
  padding-bottom: 0px;
  padding-top: 10px;
}

.article-img-head {
  width: 77px;
  height: 77px;
  padding-bottom: 4px;
  border-radius: 50%;
}

.article-time {
  color: #8A919F;
  font-size: 15px;
}

/**文章样式**/

/*卡片的样式*/

.posts {
  top: 50px;
  position: absolute;
  margin-top: 5px;
  margin-left: 15%;
  width: 70%;
}
</style>