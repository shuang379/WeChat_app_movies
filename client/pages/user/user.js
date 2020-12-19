const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')
const app = getApp()
const tabMap = {
  '收藏的影评': 'sc',
  '发布的影评': 'fb'
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabMap: tabMap,
    tab_selected: '',
    userInfo: null,
    locationAuthType: app.data.locationAuthType,
    archiveMeta: [],
    myCommentMeta:[],
    movie:{},
    comment:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  getMyComment() {
    qcloud.request({
      url: config.service.getMyComment, 
      login: true,
      success: result => {
        if (result.data.data) {
          this.setData({
            myCommentMeta: result.data.data
          })
        }
        // console.log('myCommentMeta')
        // console.log(this.data.myCommentMeta)
      },
    })
  },

  getArchiveList(){
    wx.showLoading({
      title: '数据加载中...',
    })
    qcloud.request({
      url: config.service.getArchiveMeta,
      login: true,
      success: result => {
        wx.hideLoading()
        if (!result.data.code){
          this.setData({
            archiveMeta: result.data.data
          })
        } else {
          wx.showToast({
            title: '数据加载失败',
          })
        }
        // console.log('archiveMeta')
        // console.log(this.data.archiveMeta)
      },
      fail: result => {
        wx.hideLoading()
        // console.log(result)
        wx.showToast({
          title: '数据加载失败',
        })
      }
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

  onTapArchive(event){
    let index = event.currentTarget.dataset.idx
    // console.log(index)
    this.setData({
      movie:{
        title: this.data.archiveMeta[index].title,
        image: this.data.archiveMeta[index].image,
        movie_id: this.data.archiveMeta[index].movie_id,
      },
      comment: {
        username: this.data.archiveMeta[index].username,
        avatar: this.data.archiveMeta[index].avatar,
        comment_content: this.data.archiveMeta[index].content,
        comment_id: this.data.archiveMeta[index].comment_id,
      }
    })
    // console.log(this.data.movie)
    // console.log(this.data.comment)
    var commentJason = JSON.stringify(this.data.comment)
    var movieJason = JSON.stringify(this.data.movie)
    wx.navigateTo({
      url: '/pages/comment-detail/comment-detail?comment=' + commentJason + '&movie=' + movieJason,
    })
  },

  onTapMine(event){
    let index = event.currentTarget.dataset.idx
    this.setData({
      movie: {
        title: this.data.myCommentMeta[index].title,
        image: this.data.myCommentMeta[index].image,
        movie_id: this.data.myCommentMeta[index].movie_id,
      },
      comment: {
        username: this.data.myCommentMeta[index].username,
        avatar: this.data.myCommentMeta[index].avatar,
        comment_content: this.data.myCommentMeta[index].comment_content,
        comment_id: this.data.myCommentMeta[index].comment_id,
      }
    })
    var commentJason = JSON.stringify(this.data.comment)
    var movieJason = JSON.stringify(this.data.movie)
    wx.navigateTo({
      url: '/pages/comment-detail/comment-detail?comment=' + commentJason + '&movie=' + movieJason,
    })
  },

  changeTab: function (e) {   //execute on tapping categories
    var $tab = e.currentTarget.dataset.tab
    this.setData({
      tab_selected: $tab
    })
    // console.log(this.data.tab_selected)
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
      locationAuthType: app.data.locationAuthType,
      tab_selected: 'sc',
    })
    app.checkSession({
      success: ({ userInfo }) => {
        this.setData({
          userInfo,
        })
        this.getArchiveList()
        this.getMyComment()
      }
    })
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