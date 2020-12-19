// pages/home/home.js
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: {},
    comment: {},
    movie_idx: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var movie_id = this.data.movie_idx + 1
    this.getMovie()
    this.getComment(movie_id)
  },

  getMovie(){
    wx.showLoading({
      title: '电影数据加载中...',
    })
    qcloud.request({
      url: config.service.movieList,
      success: result => {
        var idx = this.data.movie_idx
        wx.hideLoading()
        // console.log(result)
        if (!result.data.code){
          this.setData({
            movie: result.data.data[idx]
          })
        } else (
          wx.showToast({
            title: '电影数据加载失败',
          })
        )
      },
      fail: result => {
        wx.hideLoading()
        wx.showToast({
          title: '电影数据加载失败',
        })
      }
    })
  },

  getComment(movie_id) {
    wx.showLoading({
      title: '影评数据加载中...',
    })
    qcloud.request({
      url: config.service.commentList + movie_id,
      success: result => {
        wx.hideLoading()
        if (!result.data.code) {
          this.setData({
            comment: result.data.data[0]
          }) 
        } else {
          wx.showToast({
            title: '影评数据加载失败',
          })
        }
      },
      fail: result => {
        wx.hideLoading()
        wx.showToast({
          title: '影评数据加载失败',
        })
      }
    })
  },

  onTapMovie(event) {
    var id = event.currentTarget.dataset.id
    // console.log(id)
    wx.navigateTo({
      url: '/pages/movie-detail/movie-detail?id=' + id,
    })
  },

  onTapReview(event) {
    this.setData({
      movie: {
        movie_id: event.currentTarget.dataset.id,
        title: this.data.movie.title,
        image: this.data.movie.image,
      },
      comment: {
        username: this.data.comment.username,
        avatar: this.data.comment.avatar,
        comment_content: this.data.comment.content,
        conmment_id: this.data.comment.id,
      }
    })

    var movieJason = JSON.stringify(this.data.movie)
    var commentJason = JSON.stringify(this.data.comment)
    wx.navigateTo({
      url: '/pages/comment-detail/comment-detail?comment=' + commentJason + '&movie=' + movieJason,
    })
  },

  onTapHot(){
    wx.navigateTo({
      url: '/pages/movies/movies',
    })
  },

  onTapMine(){
    wx.navigateTo({
      url: '/pages/user/user',
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