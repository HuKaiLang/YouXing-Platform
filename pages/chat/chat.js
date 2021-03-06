// pages/chat/chat.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    response: "没有回复",
    messages: "",
    appKey: "43b855be72754da5875ad4735e5053ae",
    appSecret: "d27af887f3b84d66be0da5d704780305",
    cusId: "",
    timeStamp: "",
    sign: "",
    rq: "",
    api: "nli",
    NLIUrl: "https://cn.olami.ai/cloudservice/api?appkey="
  },

  changeText: function() {
    this.setData({
      response: "测试的回复",
    });
    console.log("已经更改文本");
  },

  sendMessages: function() {
    //通过that将this保存下来，success,fail和complete函数不能直接使用this,只能通过that使用当前对象中的data
    /*
      说明：参考官方文档，在success,fail和complete函数中,this所指的对象已经不是当前页面对象,所以无法通过this.data或this.setData()来使用
      或改变data中的值，而使用var that = this;则在sendMessages这个函数中声明了一个局部变量，这个变量对于函数内部来说是全局可用的，所以能
      在success,fail和complete这类回调函数中被使用。
     */
    var that = this;

    //获取app钥匙和密钥
    var appKey = that.data.appKey;
    var appSecret = that.data.appSecret;

    //获取时间戳
    var timeStamp = Date.parse(new Date());

    //调用MD5.js文件，导入MD5.js中的MD5加密算法函数
    var MD5 = require('../../MD5.js');

    //获得MD5签名，用来验证传输数据的完整性，以及数据未被篡改
    var sign = MD5.md5(appSecret + "api=nli" + "appkey=" + appKey + "timestamp=" + timeStamp + appSecret);
    console.log("生成的数字签名是:\"" + sign + "\"");

    //获得发送信息的JSON字符串
    var rqJson = {
      "data": {
        "input_type": 1,
        "text": that.data.messages,
      },
      "data_type": "stt"
    };
    var rq = JSON.stringify(rqJson);
    console.log("生成的JSON字符串是:\"" + rq + "\"");

    //将字符串存入data中
    this.setData({
      timeStamp: timeStamp,
      sign: sign,
      rq: rq,
    });

     //获取OLAMI接口API的Url地址并存入data中
    this.setData({
      NLIUrl: "https://cn.olami.ai/cloudservice/api?appkey=" + appKey + "&api=nli&timestamp=" + timeStamp + "&sign=" + sign + "&rq=" + rq + "&cusid=" + this.data.cusId
    });
    var nliUrl = that.data.NLIUrl;

    console.log("data中的timeStamp为:" + this.data.timeStamp + ",sign为" + sign + "rq为" + rq);
    console.log("api为" + this.data.api);
    console.log("nliUrl为" + nliUrl);

    //发送语义理解请求
    wx.request({
      url: nliUrl,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function(res) {
        var resData = JSON.stringify(res.data);
        var resMessages=res.data.data.nli[0].desc_obj.result;
        console.log("发送成功，返回的数据为" + resData);
        console.log(res);
        console.log(resMessages);
        that.setData({
          response:resMessages
        })
      },
      fail: function(res) {
        console.error("发送失败，错误为" + res.errMsg);
      },
      complete: function() {
        console.log("发送信息被执行");
      }
    })
    console.log("已经发送信息:\"" + that.data.messages + "\"");
  },

  inputText: function(text) {
    console.log("你输入的值为\"" + text.detail.value + "\"");
    this.setData({
      messages: text.detail.value
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");
    var result = "";
    while (result.length < 8) {
      result += characters[Math.round(Math.random() * (characters.length - 1))];
    }
    this.setData({
      cusId: result
    })
    console.log("临时用户ID已生成");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})