<template>
  <div class="posts">
    <el-card class="card-outer">
      <div class="user-box">
        <img class="img-head" v-if="true" :src="userInfo.userAvatar">
      </div>
      <p class="user-name">{{userInfo.userName}}</p>
      <p class="in-time">加入论坛时间&nbsp;:&nbsp;{{userInfo.createTime}}</p>
      <p class="brief">粉丝数:2220</p>
    </el-card>
    
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span style="color: black;font-weight: bold">基本信息</span>
        </div>
      </template>
      <el-upload
          class="avatar-uploader"
          :http-request="customRequest"
          :show-file-list="false"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
       
      </el-upload>
      <br>
      <span  style="font-size: 13px;">用户账号 : </span><span style="margin-left: 10px;font-size: 13px;">{{ userInfo.userAccount }}</span><br><br>
      <span  style="font-size: 13px;">个人简介 : </span><span style="margin-left: 10px;font-size: 13px;">{{ userInfo.userProfile }}</span><br><br>
      <span  style="font-size: 13px;">论坛简介 : </span><span style="margin-left: 10px;font-size: 13px;">论坛简介</span><br><br>
      
      
      
      <el-button type="primary" @click="updateVisible=true">
        修改信息
      </el-button>
      
      <el-dialog v-model="updateVisible" title="修改用户信息" width="30%" center>
        <el-form
            :model="updateInfo"
            label-width="60px"
            class="demo-ruleForm"
            :size="formSize"
            status-icon
        >
          <el-form-item
              prop="email"
              label="用户名"
              label-width="110px"
          >
            <el-input style="width: 75%"  v-model="updateInfo.userName" />
          </el-form-item>

          <el-form-item
              label="用户简介"
              label-width="110px"
          >

            <el-input
                v-model="updateInfo.userProfile"
                style="width: 75%"
                type="textarea"
            />
          </el-form-item>
          


          <el-form-item>
            <el-button type="primary"
                       style="margin-left:28%;margin-right: 10px" @click="updateUserInfo(updateInfo)">
              修改
            </el-button>
          </el-form-item>

        </el-form>
      </el-dialog>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref} from "vue";
import instance from "../axios/myAxios.js";
import {useRoute, useRouter} from "vue-router";
import {Plus} from '@element-plus/icons-vue'
import { ElMessage,} from 'element-plus'
import {useLogInStore} from '../stores/useLogInStore';


const router = useRouter();
const route = useRoute();

const useLogIn = useLogInStore(); //控制打开登录框


const imageUrl = ref('')

const updateVisible  = ref(false);


/** 加载页面  **/
//用户信息
const userInfo = reactive({
  userName:'',
  createTime:null,
  userProfile:null,
  userAvatar:'',
  userAccount:'',
})


// 修改用户数据
const updateInfo = reactive({
  userName:'',
  userProfile:null,
})
const updateUserInfo = ref(async (values)=>{
  console.log(values)
  await instance.post('/user/updateInfo',values).then(res=>{

    if(res.code === 40100){
      ElMessage.error("请先登录")
      useLogIn.logInState  = true;
    }
    if(res.code === 200){
      ElMessage.success("修改成功")
      window.setTimeout(function(){
        window.location.reload()
      },1000)
    }
  }).catch(error =>{
    ElMessage.error("修改失败")
  })
})



onMounted(()=>{
  LoadUserInfo();
})
async function LoadUserInfo(){
  await instance.request({
    url:'/user/info',
    method:'get',
  }).then(res=>{
    if(res.code === 40100){
      ElMessage.error("请先登录")
      useLogIn.logInState  = true;
    }
    if(res.code === 200){
      
      userInfo.userName = res.data.userName
      let time = new Date(res.data.createTime).toJSON();
      userInfo.createTime = new Date(+new Date(time) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
      userInfo.userProfile = res.data.userProfile;
      userInfo.userAccount = res.data.userAccount;
      userInfo.userAvatar = 'http://localhost:8081/'+ res.data.userAvatar.slice(3)
    }
  }).catch(error=>{
    console.log(error)
  })
}



/*** 修改图像 start***/


/** 设置上传图像请求头 **/



function customRequest(file){
  const form = new FormData()
  form.append('file', file.file)
 
  instance.post(
      '/user/UploadPicture',form
  ).then(res=>{
    if(res.code === 40100){
      ElMessage.error("请先登录")
     
      useLogIn.logInState  = true;
    }
    if(res.code === 200){
      // 调用组件内方法, 设置为成功状态
      ElMessage.success("上传成功")
      file.status = 'success'
      window.setTimeout(function(){
        window.location.reload()
      },1000)
    }else {
      file.status = 'error'
    }
  }).catch(error=>{
    ElMessage.error('上传失败')
  })
}


/*** 修改图像 end ***/


</script>

<style scoped>
.posts {
  top: 50px;
  position: absolute;
  margin-top: 5px;
  margin-left: 15%;
  width: 70%;
}

.img-head {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-box {
  float: left;
}

.user-name {
  font-size: 25px;
  margin-top: 0px;
  margin-left: 135px;
}
.in-time{
  font-size: 15px;
  margin-top: -25px;
  margin-left: 135px;
}
.brief{
  font-size: 15px;
  margin-top: -10px;
  margin-left: 135px;

}
/** 上传图片 start **/
.upload-text{
  -webkit-box-orient: vertical;
}

/** 上传图片 end **/

.avatar-uploader .avatar {
  width: 100px;
  height: 100px;
  display: block;
}

</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
}
</style>