import {createRouter, createWebHashHistory} from "vue-router";

import Home from '../views/Home.vue'
import Front from '../views/Front.vue'
import Backend from '../views/Backend.vue'
import Other from '../views/Other.vue'
import Main from '../views/Main.vue'
import ArticleContent from '../views/ArticleContent.vue';
import UserData from '../components/UserData.vue';
import {ElMessage} from 'element-plus';
import instance from "../axios/myAxios.js";
import NewPostArticle from '../views/NewPostArticle.vue'

import {useLogInStore} from '../stores/useLogInStore';


const routes = [
    {
        path: '/', component: Main,
        children: [
            {
                path: '/', redirect: '/home'
            },
            {
                path:'home',component: Home,
            },
            {
                path: 'front', component: Front,
            },
            {
                path: 'backend', component: Backend,
            },
            {
                path: 'other', component: Other,
            },
            {
                path: 'article', component: ArticleContent
            },
            {
                path:'/user/userdata',

                component: UserData,
                beforeEnter:async (to,from,next)=>{
                    if(to.name !='userLogin'){
                        await instance.request({
                            url:'/user/authentication',
                            method:'get',
                        }).then(res=>{
                            if(res.code === 40100){
                                ElMessage.error('请先登录');
                                const useLogIn = useLogInStore();
                                useLogIn.logInState  = true;
                                next(from.path)
                            }
                            if(res.code === 200){
                                next()
                            }
                        }).catch(error=>{
                            const useLogIn = useLogInStore();
                            useLogIn.logInState  = true;
                            return false;
                        })
                    }
                }
            },
        ],

    },
    
    {
        path: '/user/newArticle',component: NewPostArticle,
        beforeEnter:async (to,from,next)=>{
            if(to.name !='userLogin'){
                await instance.request({
                    url:'/user/authentication',
                    method:'get',
                }).then(res=>{
                    if(res.code === 40100){
                        ElMessage.error('请先登录');
                        const useLogIn = useLogInStore();
                        useLogIn.logInState  = true;
                        next(from.path)
                    }
                    if(res.code === 200){
                       next();
                    }
                }).catch(error=>{
                    const useLogIn = useLogInStore();
                    useLogIn.logInState  = true;
                    return false;
                })
            }
        }
    },

]
const router = createRouter({
    // 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写

})


export default router;