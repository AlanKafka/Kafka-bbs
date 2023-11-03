import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from "./router/routes.js";
import 'highlight.js/styles/atom-one-dark.css' //样式
import hljs from 'highlight.js'
import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import { createPinia } from 'pinia'
const app = createApp(App)

const pinia = createPinia()
VMdEditor.use(githubTheme, {
    Hljs: hljs,
});
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
/**代码高亮化*/
app.directive('highlight', function (el) {
    const blocks = el.querySelectorAll('pre code');
    blocks.forEach((block) => {
        hljs.highlightBlock(block)
    })
})

app.use(ElementPlus);
app.use(router);
app.use(pinia);
app.use(VMdEditor);
app.mount('#app')
