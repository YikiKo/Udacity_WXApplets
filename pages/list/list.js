// pages/list/list.js
const weatherIconMap={
  'sunny':'sunny-icon.png',
  'cloudy':'cloudy-icon.png',
  'overcast':'overcast-icon.png',
  'lightrain':'lightrain-icon.png',
  'heavyrain':'heavyrain-icon.png',
  'snow':'snow-icon.png'
}
const weekText=[
  "星期日",
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六"
]
Page({
  data: {
    weekWeather:[1,2,3,4,5,6,7],
    city:"广州市"
  },
  onLoad(options){
    console.log("onLoad")
    this.setData({
      city:options.city
    })
    this.getWeekWeather()
  },
  onReady(){
    console.log("onReady")
  },
  onPullDownRefresh(){
    this.getWeekWeather(()=>{
      wx.stopPullDownRefresh()
    })
  },
  getWeekWeather(callBack){
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/future', 
      data: {
        time:new Date().getTime(),
        city:this.data.city
      },
      header: {
        'content-type': 'application/json' 
      },
      success:res => {
        let result = res.data.result
        this.setWeekWeather(result)
      },
      complete(){
        callBack && callBack()
      }
    })
  },
  setWeekWeather(result){
    let weekWeather = []
    let date = new Date()
    for(let i = 0;i<result.length;i++)
    {
      date.setDate(date.getDate()+1);
      weekWeather.push({
        day:weekText[date.getDay()],
        date:`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} `,
        temp:`${result[i].minTemp}°-${result[i].maxTemp}°`,
        iconPath:`/images/${weatherIconMap[result[i].weather]}`
      })
    }
    console.log(weekWeather)
    this.setData({
      weekWeather
    })
  }
})