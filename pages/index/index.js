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

Page({
  onLoad(){
    this.getNow();
  },
  onPullDownRefresh(){
    this.getNow(()=>{
      wx.stopPullDownRefresh()
    });
  },
  data:{
      nowTemp:"12",
      nowWeather:"晴天",
      nowWeatherBackground:'/images/sunny-bg.png',
      forecast:[1,2,3,4,5,6]
  },
  getNow(callBack){
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now', //仅为示例，并非真实的接口地址
      data: {
        city:"广州市"
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success:res => {
        let result = res.data.result
        this.setNow(result)
        this.setHourlyWeather(result)
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
  }
})