
import axios from 'axios'
import { MessageBox, Loading } from 'element-ui'
import { getApp } from '../main.js'

/**
 * 按export 变量名
 * import {变量名} 引入
 */

const REDIRECT_TO_LOGIN = -1 // 未登录标识

// 请求拦截器
axios.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截器即异常处理
axios.interceptors.response.use(response => {
  return response
}, error => {
  if (error && error.response) {
    switch (error.response.status) {
      case 400:
        error.message = '错误请求'
        break
      case 401:
        error.message = '未授权，请重新登录'
        break
      case 403:
        error.message = '拒绝访问'
        break
      case 404:
        error.message = '请求错误,未找到该资源'
        break
      case 405:
        error.message = '请求方法未允许'
        break
      case 408:
        error.message = '请求超时'
        break
      case 500:
        error.message = '服务器端出错'
        break
      case 501:
        error.message = '网络未实现'
        break
      case 502:
        error.message = '网络错误'
        break
      case 503:
        error.message = '服务不可用'
        break
      case 504:
        error.message = '网络超时'
        break
      case 505:
        error.message = 'http版本不支持该请求'
        break
      default:
        error.message = `连接错误`
    }
  } else {
    error.message = '连接到服务器失败'
  }
  // message.error(error.message)
  return Promise.resolve({message: error.message, status: error.response.status})
})

/**
 * 判断该值是否为空
 * @param {String} data
 * @return {Boolean}
 */
export function isEmpty (data) {
  var result = false
  if (data === undefined || data === null || data === '') {
    result = true
  }
  return result
}

function redirectToLogin (url) {
  window.location.href = url
}

export function toUrl (url) {
  if (!url) {
    console.log('url未定义')
    return ''
  }
  if (!url.includes('https://')) {
    if (getApp()) {
      const {store} = getApp()
      const baseUrl = store.state.config.baseUrl || ''
      return baseUrl + url
    }
    return url
  }
  return url
}

/**
 * http请求
 * @param {String} url  请求地址
 * @param {Object} data 提交参数
 * @param {String} method 请求方式 默认值post
 * @param {Boolean}  noErrorDialog 接收到后台返回false是否不弹出错误提示 默认值为false
 */
export function http ({url, data, method = 'post', noErrorDialog = false}) {
  var loading
  var success = function (res, resolve, reject, timeout) {
    loading.close()
    if (!Array.isArray(res.data) && typeof res.data === 'object') {
      if (res.data.result === true) {
        resolve(res.data)
      } else {
        // 默认弹出错误警告窗
        if (noErrorDialog === false) {
          MessageBox.alert(res.data.msg, '警告', {comfirmButtonText: '确定', confirmButtonClass: 'el-button--danger', lockScroll: true, type: 'error'}).then(() => {
            if (res.data.errorNo === REDIRECT_TO_LOGIN) {
              // 若返回信息为 REDIRECT_TO_LOGIN 重定向至登录
              redirectToLogin(toUrl(res.data.loginUrl))
            }
          })
        } else {
          if (res.data.errorNo === REDIRECT_TO_LOGIN) {
            // 若返回信息为 REDIRECT_TO_LOGIN 重定向至登录
            redirectToLogin(toUrl(res.data.loginUrl))
          }
        }
        reject(res.data.msg)
      }
    } else {
      if (typeof res === 'object' && res.message) {
        MessageBox.alert(res.message, '警告' + res.status, {comfirmButtonText: '确定', confirmButtonClass: 'el-button--danger', lockScroll: true, type: 'error'})
      } else {
        console.log(url + '返回数据格式不正确,{result:true}')
      }
    }
  }
  var fail = function (res, resolve, reject, timeout) {
    loading.close()
    MessageBox.alert('网络异常,请稍后再试!', '警告', {comfirmButtonText: '确定', confirmButtonClass: 'el-button--danger', lockScroll: true, type: 'error'})
    reject(res)
  }

  return new Promise(function (resolve, reject) {
    loading = Loading.service({lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'})

    if (!data) {
      data = {}
    }

    if (method && method === 'get') {
      axios({
        method: 'get',
        url: url
      }).then((res) => {
        success(res, resolve, reject)
      }, (res) => {
        fail(res, resolve, reject)
      })
    } else {
      if (process.env.NODE_ENV !== 'production') {
        console.log(data)
      }
      axios({
        method: process.env.NODE_ENV === 'production' ? 'post' : 'get',
        url: url,
        data: data
      }).then((res) => {
        success(res, resolve, reject)
      }, (res) => {
        fail(res, resolve, reject)
      })
    }
  })
}

export function parseTime (time, cFormat) {
  if (time == null) {
    time = Date.now()
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return timeStr
}
