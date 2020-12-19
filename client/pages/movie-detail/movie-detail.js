// pages/movie-detail/movie-detail.js

const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie:{},
    locationAuthType: app.data.locationAuthType,
    myComment: null,
    myMovie: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMovie(options.id)
    this.setData({
      locationAuthType: app.data.locationAuthType
    })
    app.checkSession({
      success: ({ userInfo }) => {
        this.setData({
          userInfo
        })
        setTimeout(()=>{
          this.checkMyComment()}, 500)
      }
    })
  },

  checkMyComment() {
    var id = this.data.movie.id
    // console.log('checkMyComment & movie:')
    // console.log(this.data.movie)
    wx.showLoading({
      title: '数据加载中...',
      duration: 3000
    })
    qcloud.request({
      url: config.service.checkMyComment + id,
      login: true,
      success: result => {
        wx.hideLoading()
        if (result.data.data[0]) {
          let data = result.data.data[0]
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
            }
          })
        }
      },
    })
  },

  getMovie(id) {
    wx.showLoading({
      title: '数据加载中...',
      duration: 4000
    })
    qcloud.request({
      url: config.service.movieDetail + id,
      success: result => {
        wx.hideLoading()
        if (!result.data.code) {
          this.setData({
            movie: result.data.data[0]
          })
        } else {
          setTimeout(() => {
            wx.navigateBack()
          }, 2000)
        }
        // console.log('getMovie & movie:')
        // console.log(this.data.movie)
      },
      fail: result => {
        wx.hideLoading()
        setTimeout(() => {
          wx.navigateBack()
        }, 2000)
      }
    })
  },

  onTapReview(event){
    var movie_id = event.currentTarget.dataset.id
    var movie_title = event.currentTarget.dataset.title
    var movie_image = event.currentTarget.dataset.image
    wx.redirectTo({
      url: '/pages/comments/comments?movie_id=' + movie_id + '&movie_title=' + movie_title + '&movie_image=' + movie_image,
    })
  },

  openActionSheet(event){
    var id = event.currentTarget.dataset.id
    var title = event.currentTarget.dataset.title
    var image = event.currentTarget.dataset.image
    wx.showActionSheet({
      itemList: ['文字', '音频'],
      success(res) {
        if (res.tapIndex === 0) {
          wx.redirectTo({
            url: '/pages/edit-comment/edit-comment?id=' + id + '&title=' + title + '&image=' + image + '&tapIndex=' + 0,
          })
        }
        if (res.tapIndex === 1) {
          wx.redirectTo({
            url: '/pages/edit-comment/edit-comment?id=' + id + '&title=' + title + '&image=' + image + '&tapIndex=' + 1,
          })
        }
      }
    })
  },

  onTapComment(){
    var commentJason = JSON.stringify(this.data.myComment)
    var movieJason = JSON.stringify(this.data.myMovie)
    wx.redirectTo({
      url: '/pages/comment-detail/comment-detail?comment=' + commentJason + '&movie=' + movieJason,
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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