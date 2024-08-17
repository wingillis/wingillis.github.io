
document.addEventListener('DOMContentLoaded', () => {
  let mode = localStorage.getItem('mode');
  document.getElementById('darkmode').checked = mode === 'dark';
  mode === 'dark' ? document.querySelector('body').classList.add('dark') : document.querySelector('body').classList.remove('dark');
})

function updateDark() {
  let item = document.getElementById('darkmode').checked;
  localStorage.setItem('mode', item ? 'dark' : 'light' );
  localStorage.getItem('mode') === 'dark' ? document.querySelector('body').classList.add('dark') : document.querySelector('body').classList.remove('dark');
}
