const app = getApp();

const quotes = [
  { text: "数学是打开科学大门的钥匙", author: "培根" },
  { text: "想象比知识更重要", author: "爱因斯坦" },
  { text: "业精于勤，荒于嬉", author: "韩愈" },
  { text: "只要功夫深，铁杵磨成针", author: "李白" },
  { text: "书山有路勤为径，学海无涯苦作舟", author: "韩愈" },
  { text: "锲而不舍，金石可镂", author: "荀子" },
  { text: "学而不思则罔，思而不学则殆", author: "孔子" },
  { text: "宝剑锋从磨砺出，梅花香自苦寒来", author: "警联" }
];

Page({
  data: {
    quote: "",
    author: ""
  },

  onLoad: function() {
    this.loadRandomQuote();
  },

  onShow: function() {
    this.loadRandomQuote();
  },

  loadRandomQuote: function() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const selectedQuote = quotes[randomIndex];
    this.setData({
      quote: selectedQuote.text,
      author: selectedQuote.author
    });
  },

  goToLinearTransform: function() {
    wx.navigateTo({
      url: '/pages/linear-transform/select'
    });
  },

  goToElementaryTransform: function() {
    wx.navigateTo({
      url: '/pages/elementary-transform/select'
    });
  },

  goToReport: function() {
    wx.navigateTo({
      url: '/pages/report/index'
    });
  }
});
