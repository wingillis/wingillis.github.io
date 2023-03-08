
var imgs = document.querySelectorAll('.desktop-img');

imgs.forEach((im) => {
  im.style.paddingBottom = Math.round(Math.random() * 29 + 18) + 'px';
});
