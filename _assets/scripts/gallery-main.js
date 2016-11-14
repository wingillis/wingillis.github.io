var Vue = require('vue');
var imgcomp = require('./image.vue');
Vue.config.debug = true;
Vue.component('moving-img', imgcomp);

var app = new Vue({
  el: '#app',
  data: {
    x: null,
    y: null,
    sources: ['https://i.imgur.com/x0liQTZm.png','https://i.imgur.com/F6ouLAtm.png','https://i.imgur.com/sitR5mPm.png','https://i.imgur.com/is39c1Km.png','https://i.imgur.com/wau8eyim.png','https://i.imgur.com/lsQTvU3m.png','https://i.imgur.com/kZXSf0lm.png','https://i.imgur.com/a4tTvQ4m.png','https://i.imgur.com/sOuw1Rkm.png','https://i.imgur.com/ynSsSJam.png', 'https://i.imgur.com/OJNQeR4m.png', 'https://i.imgur.com/OYYwVtrm.png']
  }
});
