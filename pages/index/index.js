//index.js
//获取应用实例
const weatherMap = {
  'sunny':'晴天',
  'cloudy':'多云',
  'overcast':'阴',
  'lightrain':'小雨',
  'heavyrain':'大雨',
  'snow':'雪'
}

const weatherBackgroundMap={
  'sunny':'sunny-bg.png',
  'cloudy':'cloudy-bg.png',
  'overcast':'overcast-bg.png',
  'lightrain':'lightrain-bg.png',
  'heavyrain':'heavyrain-bg.png',
  'snow':'snow-bg.png'
}
const weatherIconMap={
  'sunny':'sunny-icon.png',
  'cloudy':'cloudy-icon.png',
  'overcast':'overcast-icon.png',
  'lightrain':'lightrain-icon.png',
  'heavyrain':'heavyrain-icon.png',
  'snow':'snow-icon.png'
}


const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
 }
 var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
 var qqmapsdk;
 const UNPROMPTED = 0
 const UNAUTHORIZED = 1
 const AUTHORIZED = 2

Page({
  onLoad(){
    this.qqmapsdk = new QQMapWX({
      key: 'FWYBZ-JA73P-LQODX-LJAQI-FMEFH-QPBB3'
  });
    wx.getSetting({
      success:res=>{
        let auth = res.authSetting["scope.userLocation"]
        this.setData({
          locationAuthType:auth?AUTHORIZED:(auth===false)?UNAUTHORIZED:UNPROMPTED
        })
        if(auth)
          this.getCityAndWeather()
        else
          this.getNow()
      }
    })

  },
  onPullDownRefresh(){
    this.getNow(()=>{
      wx.stopPullDownRefresh()
    });
  },
  data:{
    city:"北京市",
      nowTemp:"99",
      nowWeather:"究极龙卷风暴菊花台",
      nowWeatherBackground:'/images/sunny-bg.png',
      forecast:[1,2,3,4,5,6],
      todayDate:2019,
      todayTemp:16,
      locationAuthType:UNPROMPTED
      
  },
  getNow(callBack){
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now', 
      data: {
        city:this.data.city
      },
      header: {
        'content-type': 'application/json' 
      },
      success:res => {
        let result = res.data.result
        this.setNow(result)
        this.setHourlyWeather(result)
        this.setToday(result)
      },
      complete(){
        callBack&&callBack()
      }
    })
  },
  setNow(result){
    let temp = result.now.temp
    let weather = result.now.weather

    wx.setNavigationBarColor({
      backgroundColor: weatherColorMap[weather],
      frontColor: '#000000',
    })
    this.setData({
      nowTemp:temp+'°',
      nowWeather:weatherMap[weather],
      nowWeatherBackground:'/images/'+weatherBackgroundMap[weather],
    })
  },
  setHourlyWeather(result){
    let forecast_ = result.forecast
    let forecast = []
    let nowHour = new Date().getHours()
    for(let i = 0;i<forecast_.length;i++){
      forecast.push({
        time:(i*3+nowHour)%24+"时",
        iconPath:'/images/'+weatherIconMap[forecast_[i].weather],
        temp:forecast_[i].temp+"°"
      })
    }
    forecast[0].time="现在"
    this.setData({
      forecast:forecast
    })
  },
  setToday(result){
    let date = new Date()
    this.setData({
      todayTemp:`${result.today.minTemp}°-${result.today.maxTemp}°`,
      todayDate:`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} 今天`
    })
  },
  onTapDayWeather(){
    wx.showToast()
    wx.navigateTo({
      url: '/pages/list/list?city='+this.data.city,
    })
  },
  onTapLocation(){
    if(this.data.locationAuthType === UNAUTHORIZED){
      wx.openSetting({
        success:res=>{
          let auth = res.authSetting['scope.userLocation']
          if (auth){
            this.getCityAndWeather()
          }
        }
      })
    }
    else
      this.getCityAndWeather()
  },
  getCityAndWeather(){
    wx.getLocation({
      success:res=>{
        const latitude = res.latitude
        const longitude = res.longitude
        this.setData({
          locationAuthType:AUTHORIZED
        })
        this.qqmapsdk.reverseGeocoder({
            location: {
              latitude: latitude,
              longitude: longitude
            },
            success:res=>{
              let city = res.result.address_component.city
              this.setData({
                city
              })
              this.getNow()
            }
          })
     },
     fail:()=>{
       this.setData({
         locationAuthType:UNAUTHORIZED
       })
     }
    })
  }
})