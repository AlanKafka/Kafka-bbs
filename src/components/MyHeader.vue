<template>
  <div class="header" v-if="showHeader">
    <div class="header-content">
      <img src="../assets/logo.jpg">
      <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          :ellipsis="false"
          :router="true"
      >
        <el-menu-item index="/home" route="/home">首页</el-menu-item>
        <el-menu-item index="/front" route="/front">前端</el-menu-item>
        <el-menu-item index="/backend">后端</el-menu-item>
        <el-menu-item index="/other">其他</el-menu-item>

      </el-menu>

      <el-input
          v-model="inputSearch"
          placeholder="Please input"
          class="input-with-select"
          size="large"
      >
        <template #append>
          <el-button :icon="Search"/>
        </template>
      </el-input>
      <el-button size="large" class="header-button1" type="primary" @click="toNewArticle">
        <el-icon class="el-icon--left">
          <Plus/>
        </el-icon>
        发布
      </el-button>
      <el-button size="large" class="header-button2" type="primary">
        <el-icon class="el-icon--left">
          <ChatDotRound/>
        </el-icon>
        消息
      </el-button>


      <el-dropdown class="imgDropdown" >
        <span>
          <img v-if="imgFlag" class="img-head" :src="imgUrl">
          <el-avatar v-if="!imgFlag" :size="50" :icon="UserFilled" @click="useLogIn.logInState= true"/>
        </span>
        <template #dropdown>
          <el-dropdown-menu v-if="userMenu" >
            <el-dropdown-item>点赞</el-dropdown-item>
            <el-dropdown-item >
              <router-link to="/user/userdata">个人资料</router-link>
            </el-dropdown-item>
            <el-dropdown-item>历史记录</el-dropdown-item>
            <el-dropdown-item @click="logOut">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      
      <!-- 登录 start -->
      <el-dialog v-model="useLogIn.logInState" title="登录" width="30%" center>
        <el-form
            :model="formLogin"
            label-width="60px"
            class="demo-ruleForm"
            :size="formSize"
            status-icon
        >
          <el-form-item
              prop="email"
              label="账号"
          >
            <el-input  placeholder="Please input account" v-model="formLogin.userAccount" />
          </el-form-item>

          <el-form-item
              prop="password"
              label="密码"
          >
            <el-input 
                type="password"
                placeholder="Please input password"
                show-password
                v-model="formLogin.userPassword"
            />
          </el-form-item>
          
          
          <el-form-item>
            <el-button type="primary" 
                      style="margin-left:28%;margin-right: 10px" @click="LoginUser(formLogin)">
              登录
            </el-button>
            Or
            <el-link :underline="false" type="primary" style="margin-left: 10px" @click="changeRegister">注册</el-link>

          </el-form-item>
          
        </el-form>
      </el-dialog>
      <!-- 登录 end -->
      
      
      <!-- 注册 start -->
      <el-dialog v-model="registerVisible" title="注册" width="30%" center>
        <el-form
            :model="formRegister"
            label-width="60px"
            class="demo-ruleForm"
            :size="formSize"
            status-icon
        >
          <el-form-item
              prop="email"
              label="账号"
          >
            <el-input  placeholder="Please input account" v-model="formRegister.userAccount" />
          </el-form-item>

          <el-form-item
              prop="password"
              label="密码"
          >
            <el-input
                type="password"
                placeholder="Please input password"
                show-password
                v-model="formRegister.userPassword"
            />
          </el-form-item>

          <el-form-item
              prop="password"
              label="再次"
          >
            <el-input
                type="password"
                placeholder="Please again password"
                show-password
                v-model="formRegister.checkPassword"
            />
          </el-form-item>
          
          
          <el-form-item>
            <el-button type="primary"
                       style="margin-left:28%;margin-right: 10px" @click="RegisterUser(formRegister)">
              注册
            </el-button>
            Or
            <el-link :underline="false" type="primary" style="margin-left: 10px" @click="changelogIn">登录</el-link>

          </el-form-item>

        </el-form>
      </el-dialog>
      <!-- 注册 end -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref, onMounted,reactive} from 'vue'
import {Search, Plus, ChatDotRound, UserFilled} from '@element-plus/icons-vue'
import instance from "../axios/myAxios.js";
import {useRoute, useRouter} from "vue-router";
import { ElMessage } from 'element-plus';
import {useLogInStore} from '../stores/useLogInStore';
const router = useRouter();
const route = useRoute();
const activeIndex = ref('/home')

const handleSelect = (key: string, keyPath: string[]) => {
  
}
const useLogIn = useLogInStore();
const logInVisible = ref(useLogIn.logInState) // 设置打开登录框
const registerVisible = ref(false); //设置打开注册框

const toNewArticle = ref(()=>{
  router.push('/user/newArticle');
})



// 输入框 
const inputSearch = ref('')
/** 图像 **/

let imgFlag = ref(false); //设置图像不显示

let imgUrl = ref('');

let userMenu = ref(false); 






/** 搜索框功能-- start **/
const onSearch = searchValue => {   //搜索框的内容
  alert(searchValue);
};
/** 搜索框 --end  **/

const showHeader = ref(true) //设置导航头显不显示

/** 设置导航栏下滑关闭 -- start  **/
const getScrollTop = () => {
  const scrollTop =
      document.documentElement.scrollTop ||
      window.pageYOffset || document.body.scrollTop;
  return scrollTop
}
const initScroll = () => {
  let initScrollTop = getScrollTop();
  let scrollType = 0;
  window.addEventListener("scroll", () => {
    let currentScrollTop = getScrollTop();
    if (currentScrollTop > initScrollTop) {
      //向下滚动
      scrollType = 1;
    } else {
      //向上滚动
      scrollType = 0;
    }
    initScrollTop = currentScrollTop;
    if (scrollType == 1 && currentScrollTop > 120) {
      showHeader.value = false;
    } else {
      showHeader.value = true;
    }
  })
}
onMounted(() => {
  initScroll();
  Authentication();
  detectionMenu();
})

/** 导航栏下滑关闭 - end   **/



/** 鉴权 **/
async function Authentication() {
  await instance.get('/user/authentication').then(res => {
    if (res.code == 200) {
      if(res.data != null){
        imgUrl.value = 'http://localhost:8081/' + res.data.slice(3);
        imgFlag.value = true;
      }else{
        imgUrl.value = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
        imgFlag.value = true;
      }
    }
  }).catch(error => {

  })
}

async function detectionMenu(){
   let token =  window.localStorage.getItem('jwtToken');
   if(token != null){
     userMenu.value = true;
   }
}




/** 退出登录方法 **/
const logOut = ref(()=>{
  localStorage.removeItem("jwtToken");
  window.location.reload(); //刷新当前页面  
})



/**  弹出登录框   **/


const formSize = ref('default')

//登录表单数据
const formLogin = reactive({
  userAccount: '',
  userPassword: '',
});


// 注册表单数
const formRegister = reactive({
  userAccount: '',
  userPassword: '',
  checkPassword:'',
})


// 切换注册表单
const changeRegister = ref(()=>{
  useLogIn.logInState = false;
  registerVisible.value = true;
})

// 切换登录表单
const changelogIn = ref(()=>{
  registerVisible.value = false;
  useLogIn.logInState = true;
})



// 登录方法
const LoginUser = ref(async (values) => {
  await instance.post('/user/login', values).then(res => {
    if(res.code == 40001){
      ElMessage .error("密码错误")
    }
    if(res.code == 40000){
      ElMessage .error('信息错误')
    }
    if (res.code == 200) {
      ElMessage.success('登录成功')
      if (res.data.token != null) {
        //登录后添加token
        window.localStorage.setItem("jwtToken", res.data.token)
      }
      useLogIn.logInState = false;
      window.setTimeout(function(){
        window.location.reload();
      },100)
      
    }
  }).catch(error => {
    ElMessage .error('登录失败')
  })
});

/** 注册表单 **/
const RegisterUser = ref(async (values) => {
  console.log(values)
  await instance.post('/user/register',values).then(res=>{
    console.log(res)
    if(res.code == 200){
      ElMessage.success('注册成功,请登录')
      registerVisible.value = false;
      useLogIn.logInState  = true;
    }
  }).catch(error=>{
    ElMessage.error("注册失败")
  })
});




/**  弹出登录框end   **/
</script>

<style scoped>
.header {
  top: 0;
  left: 0;
  height: 54px;
  width: 100%;
  position: fixed;
  z-index: 1000;
  box-shadow: 0 2px 6px #ddd;
  background: #fff;
}

.header-content {
  width: 70%;
  margin: 0px auto;
  align-items: center;
  display: flex;
  height: 50px;
}

.header-button1 {
  margin-left: 20px;
  margin-right: 10px;
}

.header-button2 {
  margin-right: 20px;
}

.img-head {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}


.imgDropdown {
  top: 2px;
}

:deep(.el-tooltip__trigger:focus-visible) {
  outline: unset;
}

.demo-basic {
  text-align: center;
}

.demo-basic .sub-title {
  margin-bottom: 10px;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.demo-basic .demo-basic--circle,
.demo-basic .demo-basic--square {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.demo-basic .block:not(:last-child) {
  border-right: 1px solid var(--el-border-color);
}

.demo-basic .block {
  flex: 1;
}

.demo-basic .el-col:not(:last-child) {
  border-right: 1px solid var(--el-border-color);
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>