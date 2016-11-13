<template>
<div class="pure-u-1 pure-u-sm-1-3 pure-u-md-1-5 pure-u-lg-1-5 pure-u-xl-1-5">
  <div class="min-padding">
    <a :href="largeUrl" target="_blank">
      <div id="im" class="thumbnail pure-img" style="background-size: 290%;"
      v-on:mousemove="offsetThumbnail($event)"
      v-bind:style="{'background-position': x + 'px ' + y + 'px', 'background-image': 'url(' + url + ')', height: height + 'px'}" v-el:div>

      </div>
    </a>

  </div>
</div>
</template>

<script>
export default {
  props: ['url'],
  data: function() {
    return {
      x: 0,
      y: 0,
      height: 0,
      largeUrl: this.url.replace('m.png', '.png'),
      div: null
    };
  },
  attached() {
    var d = this.$els.div;
    this.x = -d.clientWidth/2;
    this.y = 0;
    var ctx = this;
    setInterval(function(){
      ctx.height = d.clientWidth;
    }, 500);
  },
  methods: {
    offsetThumbnail: function (e) {

      var diffX = e.target.clientWidth/2 - (e.pageX - e.target.offsetLeft);
      var diffY = e.target.clientHeight/2 - (e.pageY - e.target.offsetTop);
      this.x = diffX/3 - e.target.clientWidth/2;
      this.y = diffY/3 - e.target.clientHeight/2;
    }
  }
}
</script>
