//获取应用实例  
var app = getApp()
Page({
  data: {
    latitude: 0,//纬度  
    longitude: 0,//经度  
    speed: 0,//速度  
    accuracy: 16,//位置精准度  
    markers: [],
    covers: [],
  },
  onLoad: function () {
    this.getlocation();
  },
  getlocation: function () {
    var markers = [{
      latitude: 31.379376702982793,
      longitude: 121.4922559261322 ,
      name: '浦东新区',
      desc: '我的位置'
    }]
    var covers = [{
      latitude: 31.379376702982793,
      longitude: 121.4922559261322,
      rotate: 0
    }]
    this.setData({
      latitude: 31.379376702982793,
      longitude: 121.4922559261322,
      markers: markers,
      covers: covers,
    })
  }
})  