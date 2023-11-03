<template>
  <div style="width: 100%">
    <el-form
        :model="formState"
        label-width="60px"
        class="demo-ruleForm"
        
        status-icon
    >
      <el-form-item
          prop="email"
          label-width="0px"
          size="large"
          style="top: 0px;"
      >
        <div style="display: inline-flex;width: 100%;">
          <el-input placeholder="输入文章标题" style="width: 95%"  v-model="formState.title" />
          <el-button type="primary"
                     size="large"
                     style="margin-left: 10px;margin-top:10px;margin-right: 10px"
                     @click="changeArticleVisible"
          >
            发布
          </el-button>
          <img  class="img-head" src="../assets/logo.jpg">
        </div>
        
      </el-form-item>

      <el-button type="primary" shape="round" style="margin-bottom: 10px"  @click="changeEditor">
        <el-icon><Switch /></el-icon>
        切换为{{ editorType == 0 ? '富文本编辑器' : 'markdown编辑器' }}
      </el-button>
      <!-- markdown 文档 -->
      <div style="height: auto;">
        <v-md-editor :model-value="formState.markdownContent" mode="html" height="690px"
                     v-if="editorType == 0"></v-md-editor>

        <div style="border: 1px solid #ccc;height: 690px;" v-if="editorType == 1">
          <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editorRef"
              :defaultConfig="toolbarConfig"
              :mode="mode"
          />
          <Editor
              style="height: 500px; overflow-y: hidden;"
              v-model="valueHtml"
              :defaultConfig="editorConfig"
              :mode="mode"
              @onCreated="handleCreated"
          />
        </div>
      </div>
      
      <el-dialog v-model="articleVisible" title="文章信息" width="50%" center>
        <el-form
            label-width="60px"
            class="demo-ruleForm"
           
            status-icon
        >
          <el-form-item
              prop="email"
              label="分类"
              label-width="50px"
          >
            <el-select v-model="formState.label" placeholder="请选择文章分类">
              <el-option label="前端" value="0" />
              <el-option label="后端" value="1" />
              <el-option label="其他" value="-1" />
            </el-select>
          </el-form-item>
          
          
          <el-form-item>
            <el-upload
                list-type="picture-card"
                :http-request="customRequest"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>

            <el-dialog v-model="dialogVisible">
              <img w-full :src="dialogImageUrl" alt="Preview Image" />
            </el-dialog>
          </el-form-item>
          
          <el-form-item
              prop="email"
              label="简介"
              label-width="50px"
          >
            <el-input
                v-model="formState.summary"
                :rows="6"
                type="textarea"
                placeholder="Please input"
            />
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary"
                       style="margin-left:37%;margin-right: 45%" @click="onFinish(formState)">
              发布
            </el-button>
          </el-form-item>

        </el-form>
      </el-dialog>

    </el-form>
   
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, reactive, ref, shallowRef} from "vue";

import {useRoute, useRouter} from "vue-router";
import instance from "../axios/myAxios.js";

import VueMarkdownEditor, {xss} from '@kangc/v-md-editor';
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { ElMessage,} from 'element-plus'
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'
import type { UploadProps, UploadUserFile } from 'element-plus'
const router = useRouter();
const route = useRoute();
import {useLogInStore} from '../stores/useLogInStore';


const dialogImageUrl = ref('')
const dialogVisible = ref(false)


//点击发布弹出框
const articleVisible = ref(false);

const changeArticleVisible = ref(()=>{
  articleVisible.value = true;
})

//切换文本编辑器
let editorType = ref(0)
const changeEditor = ref(() => {
  editorType.value = editorType.value == 0 ? 1 : 0;
  window.localStorage.setItem("markdownContent", formState.markdownContent)
})


/******* 富文本编辑器 start  *******/


const valueHtml = ref('')
const mode = ref('default')
const editorRef = shallowRef()

const toolbarConfig = {}
const editorConfig = {placeholder: '请输入内容...'}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}


/******* 富文本编辑器  end *******/


/***** 表单提交start *****/

const formState = reactive({
  title: '', //标题
  label: '', //标签
  content: '',//内容
  summary: '',//摘要
  markdownContent: '',
  file:[],
});


function customRequest(file){
  formState.file = file.file;
 
}

const onFinish = ref(async (values) => {
  let formData = new FormData()
  formData.set('title', formState.title)
  formData.set('label', formState.label)
  formData.set('summary', formState.summary)
  formData.set('file',formState.file)
  if(formState.markdownContent!=null){
    formData.set('markdownContent', formState.markdownContent)
    formState.content = ref(xss.process(VueMarkdownEditor.vMdParser.themeConfig.markdownParser.render(formState.markdownContent)));
    formData.set('content', formState.content)
  }
  if(valueHtml.value !=null){
    formData.set('markdownContent', valueHtml.value)
    formState.content = valueHtml.value;
    formData.set('content', formState.content);
  }
  formData.set('editorType',editorType.value)
  console.log(formData);
  await instance.post('/article/newPost', formData).then(res => {
    
    if(res.code == 200){
      ElMessage.success("发布成功");
      router.push('/');
    }
    if(res.code == 40100){
      ElMessage.error("请先登录");
      const useLogIn = useLogInStore();
      useLogIn.logInState  = true;
    }
  }).catch(error => {
    ElMessage.error("发布失败");
  })
});
const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};

/****** 表单提交end *******/

</script>

<style scoped>
.img-head {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 0px;
}
.all-page {
  width: 100%;
  height: 100%;
}

.head-article {
  display: -webkit-flex;
}

.head-img {
  width: 20%;
  height: 200px;
  margin-bottom: 15px;
}


.head-form {
  margin-right: 10px;
  width: 80%;
  margin-left: 15px;
}
</style>