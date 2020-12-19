// pages/comments/comments.js
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentList: [],
    movie: {},
    comment: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onPullDownRefresh(){
    this.getCommentList(this.data.movie.movie_id, ()=>{
      wx.stopPullDownRefresh()
    })
  },

  onLoad: function (options) {
    this.setData({
      movie: {
        title: options.movie_title,
        image: options.movie_image,
        movie_id: options.movie_id,
      }
    })
    this.getCommentList(this.data.movie.movie_id, ()=>{})
  },

  getCommentList(movie_id, callBack) {
    wx.showLoading({
      title: '影评数据加载中...',
    })
    qcloud.request({
      url: config.service.commentList + movie_id,
      success: result => {
        wx.hideLoading()
        if (!result.data.code) {
          // console.log(result)
          this.setData({
            commentList: result.data.data
          })
        } else {
          wx.showToast({
            title: '影评数据加载失败',
          })
        }
        // console.log(this.data.commentList)
      },
      fail: result => {
        wx.hideLoading()
        wx.showToast({
          title: '影评数据加载失败',
        })
      },
      complete: () => {
        callBack & callBack()
      }
    })
  },

  onTapReview(event){ 
    this.setData({
      comment:{
        username: event.currentTarget.dataset.username,
        avatar: event.currentTarget.dataset.avatar,
        comment_content: event.currentTarget.dataset.content,
        comment_id: event.currentTarget.dataset.comment_id
      }
    })
    // console.log(this.data.comment_content)
    var commentJason = JSON.stringify(this.data.comment)
    var movieJason = JSON.stringify(this.data.movie)
    wx.navigateTo({
      url: '/pages/comment-detail/comment-detail?comment=' + commentJason + '&movie=' + movieJason,
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