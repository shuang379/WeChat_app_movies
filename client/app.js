//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index.js')
var config = require('./config.js')

let userInfo

const UNPROMPTED = 0
const UNAUTHORIZED = 1
const AUTHORIZED = 2

App({
  onLaunch: function () {
    qcloud.setLoginUrl(config.service.loginUrl)
  },

  data: {
    locationAuthType: UNPROMPTED
  },

  login({ success, error }) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo'] === false) {
          this.data.locationAuthType = UNAUTHORIZED
          wx.showModal({
            title: '提示',
            content: '请授权我们获取您的用户信息',
            showCancel: false
          })
          error && error()
        } else {
          this.data.locationAuthType = AUTHORIZED
          this.doQcloudLogin({ success, error })
        }
      }
    })
  },

  doQcloudLogin({ success, error }) {
    // 调用qcloud登陆接口
    qcloud.login({
      success: result => {
        // console.log(result)
        if (result) {
          // 首次登陆会有result返回
          let userInfo = result
          success && success({
            userInfo
          })
        } else {
          // 如果不是首次登陆，没有result返回，请求用户信息接口获取
          this.getUserInfo({ success, error })
        }
      },
      fail: () => {
        error && error()
      }
    })
  },

  getUserInfo({ success, error }) {
    if (userInfo) return userInfo   //why this?
    qcloud.request({
      url: config.service.requestUrl,
      login: true,
      success: result => {
        let data = result.data
        if (!data.code) {
          let userInfo = data.data
          success && success({
            userInfo
          })
        } else {
          error && error()
        }
      },
      fail: () => {
        error && error()
      }
    })
  },

  checkSession({ success, error }) {
    if (userInfo) {
      return success && success({
        userInfo: userInfo
      })
    }
    wx.checkSession({
      success: () => {
        this.getUserInfo({
          success: res => {
            userInfo = res.userInfo
            success && success({
              userInfo
            })
          },
          fail: () => {
            error && error()
          }
        })
      },
      fail: () => {
        error && error()
      }
    })
  },
})