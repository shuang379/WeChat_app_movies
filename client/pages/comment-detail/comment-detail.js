// pages/comment-detail/comment-detail.js
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')
const app = getApp()
const innerAudioContext = wx.createInnerAudioContext()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    locationAuthType: app.data.locationAuthType,
    userInfo: null,
    comment:{},
    movie:{},
    myComment: null,
    myMovie: {},
    comment_type:null,
    audio_duration:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var comment = JSON.parse(options.comment)
    var movie = JSON.parse(options.movie)
    this.setData({
      locationAuthType: app.data.locationAuthType,
      comment: comment,
      movie: movie
    })
    app.checkSession({
      success: ({ userInfo }) => {
        this.setData({
          userInfo
        })
        this.checkMyComment()
        wx.showLoading({
          title: '数据加载中...',
          duration: 4000
        })
      }
    })
  },

  onTapComment(){
    this.setData({
      comment: this.data.myComment,
      movie: this.data.myMovie
    })
  },

  checkMyComment(){
    var id = this.data.movie.movie_id
    qcloud.request({
      url: config.service.checkMyComment + id,
      login: true,
      success: result => {
        if (result.data.data[0]) {
          let data = result.data.data[0]
          // console.log(data)
          this.setData({
            myComment: {
              username: data.username,
              avatar: data.avatar,
              comment_content: data.comment_content,
              comment_id: data.comment_id,
            },
            myMovie: {
              title: data.title,
              image: data.image,
              movie_id: data.movie_id,
            },
            comment_type:data.comment_type,
            audio_duration: data.audio_duration
          })
        }
      },
    })
  },

  onTapLogin: function () {
    app.login({
      success: ({ userInfo }) => {
        this.setData({
          userInfo,
          locationAuthType: app.data.locationAuthType
        })
      },
      error: () => {
        this.setData({
          locationAuthType: app.data.locationAuthType
        })
      }
    })
  },

  openActionSheet(event) {
    var title = event.currentTarget.dataset.title
    var image = event.currentTarget.dataset.image
    let id = this.data.movie.movie_id
    wx.showActionSheet({
      itemList: ['文字', '音频'],
      success(res) {
        if (res.tapIndex === 0) {
          wx.navigateTo({
            url: '/pages/edit-comment/edit-comment?id=' + id + '&title=' + title + '&image=' + image + '&tapIndex=' + 0,
          })
        }
        if (res.tapIndex === 1) {
          wx.navigateTo({
            url: '/pages/edit-comment/edit-comment?id=' + id + '&title=' + title + '&image=' + image + '&tapIndex=' + 1,
          })
        }
      }
    })
  },

  onTapArchive() {
    wx.showLoading({
      title: '收藏影评...',
    })
    qcloud.request({
      url: config.service.addArchive,
      login: true,
      method: 'POST',
      data: {
        comment_id: this.data.comment.comment_id,
      },
      success: result => {
        wx.hideLoading()

        let data = result.data
        if (!data.code){
          wx.showToast({
            title: '影评收藏成功',
          })
        } else {
          wx.showToast({
            icon:'none',
            title: '影评收藏失败',
          })
        }
      },
      fail: () =>{
        wx.hideLoading()
        wx.showToast({
          icon:'none',
          title: '影评收藏失败',
        })
      }
    })
  },

  onTapAudio(){
    innerAudioContext.autoplay = true
    innerAudioContext.src = this.data.comment.comment_content,
      innerAudioContext.onPlay(() => {
      })
  }
})