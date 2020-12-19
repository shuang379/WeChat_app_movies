// pages/edit-comment/edit-comment.js
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')

const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
const recordStart = 1
const recordStop = 2
const recordPlay = 3
const recordRedo = 4
// var tempFilePath = '123'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: {},
    content :'',
    tapIndex:null,
    comment_type: null,
    buttonStatus: 1,
    startTime:null,
    endTime: null,
    comment_type:null,
    tempFilePath: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      movie:{
        id: options.id,
        title: options.title,
        image: options.image
      },
      tapIndex: options.tapIndex,
      comment_type: +options.tapIndex + 1
    })
  },

  onTapTextDone() {
    var id = this.data.movie.id
    var title = this.data.movie.title
    var image = this.data.movie.image
    let content = this.data.content
    if (!content) return
    wx.navigateTo({
      url: '/pages/preview-comment/preview-comment?id=' + id + '&title=' + title + '&image=' + image + '&content=' + this.data.content + '&comment_type=' + this.data.comment_type + '&audio_duration=' + 0,
    })
  },

  inputContent(event) {
    this.setData({
      content: event.detail.value
    })
  },

  onTapStart(event){
    this.setData({
      buttonStatus: 2,
      startTime: event.timeStamp
    })
    const settings = {
      duration: 60000, //最长录音长度设为1分钟
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'mp3',
      frameSize: 50,
    }
    recorderManager.start(settings)
    recorderManager.onStart()
  },
  
  onTapStop(event){
    var that = this
    this.setData({
      buttonStatus: 3,
      endTime: event.timeStamp
    })
    recorderManager.stop();
    recorderManager.onStop(function(res){
      that.setData({
        tempFilePath: res.tempFilePath
      })
    })
  },

  onTapPlay(){
    this.setData({
      buttonStatus: 4
    })
    innerAudioContext.autoplay = true
    innerAudioContext.src = this.data.tempFilePath,
      innerAudioContext.onPlay(() => {
      
      })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },

  onTapRecordDone(){
    let audio_duration = Math.ceil((this.data.endTime - this.data.startTime)/1000)
    // console.log(audio_duration)
    let id = this.data.movie.id
    let title = this.data.movie.title
    let image = this.data.movie.image
    // let content = this.data.tempFilePath
    let comment_type = this.data.comment_type
    console.log(this.data.tempFilePath)
    // console.log(this.data.tempFilePath+1)
    if (!this.data.tempFilePath) return
    wx.navigateTo({
      url: '/pages/preview-comment/preview-comment?id=' + id + '&title=' + title + '&image=' + image + '&content=' + encodeURIComponent(this.data.tempFilePath) + '&comment_type=' + comment_type + '&audio_duration=' + audio_duration,
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