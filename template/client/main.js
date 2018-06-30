{{#if_eq build "standalone"}}
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
{{/if_eq}}
import createApp from './create-app'

// 创建vue实例
const {app, router, store} = createApp()

// 整个项目初始化的时候 请求config参数将全局参数存入store
router.onReady(() => {
  store.dispatch('setConfig').then(() => {
    app.$mount('#app') // 挂载到html的div
  })
})

export function getApp () {
  return {app, router, store}
}
