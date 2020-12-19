// pages/preview-comment/preview-comment.js

const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')
const app = getApp()
const innerAudioContext = wx.createInnerAudioContext()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: {},
    content: '',
    comment_type:null,
    userInfo: null,
    locationAuthType: app.data.locationAuthType,
    audio_duration:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      movie: {
        id: options.id,
        title: options.title,
        image: options.image
      },
      content: decodeURIComponent(options.content),
      comment_type: options.comment_type,
      audio_duration: options.audio_duration,
    })
    // console.log(this.data.comment_type)
  },

  onTapTextRelease(){
    let id = this.data.movie.id
    let title = this.data.movie.title
    let image = this.data.movie.image
    wx.showLoading({
      title: '正在发表评论',
    })
    qcloud.request({
      url: config.service.addComment,
      login: true,
      method: 'POST',
      data: {
        movie_id: id,
        content: this.data.content,
        comment_type: 1,  // 1代表文字，2代表录音
        audio_duration: 0
      },
      success: result => {
        wx.hideLoading()
        let data = result.data
        if (!data.code) {
          wx.navigateTo({
            url: '/pages/comments/comments?movie_id=' + id + '&movie_title=' + title + '&movie_image=' + image,
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '发表评论失败',
          })
        }
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '发表评论失败',
        })
      }
    })
  },

  onTapAudioRelease(){
    wx.showLoading({
      title: '影评正在发布...'
    })
    wx.uploadFile({
      url: config.service.uploadUrl,
      filePath: this.data.content,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data",
        'accept': 'application/json',
      },
      success: result => {
        wx.hideLoading()
        let data = JSON.parse(result.data)
        // console.log(data)
        if (!data.code){
          this.setData({
            content: data.data.imgUrl
          })
          // console.log(this.data.content)
          // wx.showLoading({
          //   title: '影评上传成功，正在发布...',
          //   icon: 'success',
          // })
          qcloud.request({
            url: config.service.addComment,
            login: true,
            method: 'POST',
            data: {
              movie_id: this.data.movie.id,
              content: this.data.content,
              comment_type: 2,  // 1代表文字，2代表录音
              audio_duration: this.data.audio_duration
            },
            success: result => {
              wx.hideLoading()
              let data = result.data
              if (!data.code) {
                wx.navigateTo({
                  url: '/pages/comments/comments?movie_id=' + this.data.movie.id + '&movie_title=' + this.data.movie.title + '&movie_image=' + this.data.movie.image,
                })
              } else {
                wx.showToast({
                  icon: 'none',
                  title: '发布评论失败',
                })
              }
            },
            fail: () => {
              wx.hideLoading()
              wx.showToast({
                icon: 'none',
                title: '发布评论失败',
              })
            }
          })
        } else {
          wx.showToast({
            title: '影评上传失败',
          })
        }
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },

  onTapAudio() {
    console.log(this.data.content)
    innerAudioContext.autoplay = true
    innerAudioContext.src = this.data.content,
      innerAudioContext.onPlay(() => {
      })
  },

  onTapRedo(){
    wx.navigateBack({})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      locationAuthType: app.data.locationAuthType
    })
    app.checkSession({
      success: ({ userInfo }) => {
        this.setData({
          userInfo
        })
      }
    })
    // console.log(this.data.userInfo)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})