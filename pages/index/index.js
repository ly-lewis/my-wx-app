//index.js
//获取应用实例
var app = getApp();
Page({
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    circular: true,
    toView: 'red',
    scrollTop: 100,
    //request后台数据
    list:[],
    newsList:[]
  },
  //事件处理函数
  bindViewTap: function(event) {
    //console.log(event)
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //跳转到音乐界面
  toMusic: function (e) {
    //console.log(e)
    wx.reLaunch({
      url: "/pages/music/music?id=" + e.currentTarget.dataset.songid
    })
  },
  //跳转到新闻界面
  toNews: function (e) {
    //console.log(e)
    wx.reLaunch({
      url: "/pages/news/news"
    })
  },
  onLoad: function () {
    //console.log(this)
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  },
  onReady:function(){
    var that = this;
    wx.request({
      url: 'http://tingapi.ting.baidu.com/v1/restserver/ting?method=baidu.ting.billboard.billList', 
      data: {
        type: 1,
        size: 20,
        offset: 0
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var picList = [];
        that.setData({
          list: res.data.song_list
        })
      }
    })
    //获取新闻信息
    wx.request({
      url: 'http://v.juhe.cn/toutiao/index?key=e3172893178deeeaacbd2ab69c5400d7&type=toutiao',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //console.log(res.data.result.data)
        var list_1 = res.data.result.data;
        that.setData({
          newsList: list_1
        })
      }
    })
  },
  upper: function (e) {
    console.log(e)
  },
  lower: function (e) {
    console.log(e)
  },
  scroll: function (e) {
    console.log(e)
  }
})
