// pages/news/news.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsList:[],
    type:'',
    newsKey:'',
    autoplay: true,
    interval: 3000,
    duration: 1000,
    circular: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.request({
      url: 'http://v.juhe.cn/toutiao/index?key=e3172893178deeeaacbd2ab69c5400d7&type=toutiao',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //console.log(res.data.result.data)
        var list_1 = res.data.result.data;
        _this.setData({
          newsList: list_1
        })
      }
    })
    console.log(_this.newsList)
  },

  newsLists: function (event) {
    //console.log(event)
    var _this = this;
    var url = 'http://v.juhe.cn/toutiao/index?key=e3172893178deeeaacbd2ab69c5400d7&type=' + event.currentTarget.dataset.type;
    //请求数据
    wx.showLoading({
      title: '新闻加载中',
    })
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //console.log(res.data.result.data)
        var list_1 = res.data.result.data;
        _this.setData({
          newsList: list_1
        })
      }
    })
      wx.hideLoading();
  },
  newsDetail: function (event){
    //console.log(event)
    //点击从event中取出key值  通过key找到匹配的对象  把对象作为参数传递
    var _this = this;
    for (var i = 0; i < _this.data.newsList.length;i++){
      console.log(_this.data.newsList)
      if (_this.data.newsList[i].uniquekey == event.currentTarget.dataset.key){
        wx.navigateTo({
          url: "/pages/news_detail/news_detail?detail=" + JSON.stringify(_this.data.newsList[i])
        });
        break;
      } 
    }

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