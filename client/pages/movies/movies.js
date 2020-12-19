// pages/movies/movies.js
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    locationAuthType: app.data.locationAuthType,
    movieList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onPullDownRefresh(){
    this.getMovieList(()=>{wx.stopPullDownRefresh()})
  },

  onLoad: function (options) {
    this.setData({
      locationAuthType: app.data.locationAuthType
    })
    this.getMovieList(() => { })
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

  onTapMovie(event){
    var id = event.currentTarget.dataset.id
    // wx.navigateTo({
    //   url: '/pages/movie-detail/movie-detail?id=' + id,
    // })
    wx.redirectTo({
      url: '/pages/movie-detail/movie-detail?id=' + id,
    })
  },

  getMovieList(callBack) {
    wx.showLoading({
      title: '数据加载中...',
    })
    qcloud.request({
      url: config.service.movieList,
      success: result => {
        // console.log(result)
        wx.hideLoading()
        if (!result.data.code) {
          this.setData({
            movieList: result.data.data
          })
        } else (
          wx.showToast({
            title: '数据加载失败',
          })
        )
      },
      fail: result => {
        wx.hideLoading()
        wx.showToast({
          title: '数据加载失败',
        })
      },
      complete: () => {
        callBack & callBack()
      }
    })
  },

  onShow: function () {
 
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