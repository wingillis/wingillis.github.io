var Vue = require('vue');
var imgcomp = require('./image.vue');
Vue.config.debug = true;
Vue.component('moving-img', imgcomp);

var app = new Vue({
  el: '#app',
  data: {
    x: null,
    y: null,
    sources: ['http://i.imgur.com/x0liQTZm.png','http://i.imgur.com/F6ouLAtm.png','http://i.imgur.com/sitR5mPm.png','http://i.imgur.com/is39c1Km.png','http://i.imgur.com/wau8eyim.png','http://i.imgur.com/lsQTvU3m.png','http://i.imgur.com/kZXSf0lm.png','http://i.imgur.com/a4tTvQ4m.png','http://i.imgur.com/sOuw1Rkm.png','http://i.imgur.com/ynSsSJam.png', 'http://i.imgur.com/OJNQeR4m.png', 'http://i.imgur.com/OYYwVtrm.png']
  }
});
