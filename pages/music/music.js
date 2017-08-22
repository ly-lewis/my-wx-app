// pages/music/music.js

//解析歌词
function parseLyric(lrc) {
  var lyrics = lrc.split("\n");
  var lrcObj = {};
  for (var i = 0; i < lyrics.length; i++) {
    var lyric = decodeURIComponent(lyrics[i]);
    var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
    var timeRegExpArr = lyric.match(timeReg);
    if (!timeRegExpArr) continue;
    var clause = lyric.replace(timeReg, '');
    for (var k = 0, h = timeRegExpArr.length; k < h; k++) {
      var t = timeRegExpArr[k];
      var min = Number(String(t.match(/\[\d*/i)).slice(1)),
        sec = Number(String(t.match(/\:\d*/i)).slice(1));
      var time = min * 60 + sec;
      lrcObj[time] = clause;
    }
  }
  return lrcObj;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    songList:[],
    songIdList:[],
    scrollHeight:0,
    size:7,
    offset:0,
    type:1,
    page:1,
    song_id:0,
    music:{},
    playMusicId:0,  //当前播放歌曲的下标
    musicLrc:'',
    musicLineLrc:'',
    musicPercent: 0,
    id_1:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.setData({
      id_1: options.id,
    });
  
  //获取audio对象
  _this.audioCtx = wx.createAudioContext('myAudio');
  //获取设备信息
  wx.getSystemInfo({
    success: function (res) {
      _this.setData({
        scrollHeight : res.windowHeight -100  //？？？
      })
    }
  })


  //请求数据
  wx.request({
    url: 'http://tingapi.ting.baidu.com/v1/restserver/ting?method=baidu.ting.billboard.billList',
    data: {
      type: _this.data.type,
      size: _this.data.size,
      offset: _this.data.offset
    },
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      var idList = [];
      for(var i =0;i<res.data.song_list.length;i ++){
        idList.push(res.data.song_list[i].song_id)
      }
      //设置歌曲列表
      _this.setData({
        songIdList:idList,
        songList: res.data.song_list
      })
       //请求结束
       wx.hideLoading();
       //页面累加
       _this.data.page ++ ;
       //从主页直接播放 和 自动播放需要判断
       if (_this.data.id_1 == undefined) {
         _this.playIdMusic(_this.data.songList[4].song_id);
       } else {
         //自动播放
         _this.playIdMusic(_this.data.id_1);
       }
    }
  })
  },
  onReady:function(){

  },
  //加载更多
  loadMore:function(){
    var _this = this;
    wx.showLoading({
      title: '歌曲加载中',
      mask:true
    })
    //计算offset
    var newOffset = (_this.data.page - 1) * _this.data.size;
    //下拉请求数据
    wx.request({
      url: 'http://tingapi.ting.baidu.com/v1/restserver/ting?method=baidu.ting.billboard.billList', //仅为示例，并非真实的接口地址
      data: {
        type: _this.data.type,
        size: _this.data.size,
        offset: newOffset
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        for (var i = 0; i < res.data.song_list.length; i++) {
          _this.data.songList.push(res.data.song_list[i]);
          _this.data.songIdList.push(res.data.song_list[i].song_id)
        }
        _this.setData({
          songIdList: _this.data.songIdList,
          songList: _this.data.songList
        })
        // //请求结束
        setTimeout(function(){
          wx.hideLoading();
        },2000)
        //页面累加
        _this.data.page++;
      }
    })

  },
  //播放下一首
  playNextMusic:function(){
    // 播放下一首歌曲
    var _this = this;
    var nextMusicPos = _this.data.playingMusicId + 1;
    var nextMusicSongId = _this.data.songIdList[nextMusicPos];
       _this.playIdMusic(nextMusicSongId);
    _this.setData({
      playingMusicId: nextMusicPos
    })
  },
  //播放指定的歌曲
  playIdMusic: function (songId){
    var _this = this;
    var url = 'http://tingapi.ting.baidu.com/v1/restserver/ting?method=baidu.ting.song.play&songid=' + songId;
    //根据url获取歌词
    wx.request({
      url: url,
      success: function (res) {
        _this.setData({
          music: res.data,
        });
       //console.log(url)
        //请求歌词
        wx.request({
          url: res.data.songinfo.lrclink,
          success: function (res) {
            if (url) {
              _this.setData({
                musicLrc: parseLyric(res.data)
              })
            }
            // parseLyric进行了歌词的解析
             _this.audioCtx.play();

          }
        })
      }
    })
  },
  //播放歌曲
  playMusic:function(event){
    var _this = this;
    var url = 'http://tingapi.ting.baidu.com/v1/restserver/ting?method=baidu.ting.song.play&songid='+event.target.dataset.songid;
    //根据url获取歌词
    wx.request({
      url: url, 
      success: function (res) {
        _this.setData({
          music:res.data,
        });
        //请求歌词
        wx.request({
          url: res.data.songinfo.lrclink,
          success: function (res) {
           if(url){
             _this.setData({
               musicLrc: parseLyric(res.data)
             })
           }
            _this.audioCtx.play();

          }
        })
      }
    })
  },
  //歌词显示
  changeMusicLrc: function (event) {
    // 当前时间和百分比
    var timePosition = Math.floor(event.detail.currentTime);
    var musicPercent = parseInt(event.detail.currentTime / event.detail.duration * 100);
    var _this = this;
    _this.setData({
      musicPercent: musicPercent,
      musicLineLrc: _this.data.musicLrc[timePosition]
    })
  }
})