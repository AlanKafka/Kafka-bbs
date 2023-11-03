import { defineStore } from 'pinia'


export const useLogInStore = defineStore('useLogInStore', {
    state: () => {
        return { logInState: false }
    },
    // 也可以这样定义
    // state: () => ({ count: 0 })
    actions: {
        increment() {
           
        },
    },
})
