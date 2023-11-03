import axios from "axios";
const instance = axios.create({
    baseURL:"http://localhost:8081/api",
    timeout: 10000,
});

//添加请求拦截器
instance.interceptors.request.use(
    config =>{
        //添加统一的请求头
        config.headers['jwtToken'] = window.localStorage.getItem("jwtToken")
        return config;
    },
    error => {
        return Promise.reject(error)
    }

)
//添加响应拦截器
instance.interceptors.response.use(
    function (response) {
        // 2xx 范围内的状态码都会触发该函数。
        // 对响应数据做点什么
        const data = response.data
        // console.log(response)
        if(data.code == 200){
            return data;
        }
        return data;
    },
    function (error) {
        // 超出 2xx 范围的状态码都会触发该函数。
        // 对响应错误做点什么
        return Promise.reject(error);
    }
);
export default  instance;