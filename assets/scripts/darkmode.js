function applyDarkMode() {
  const isDarkMode = localStorage.getItem('mode') === 'dark';
  document.querySelector('body').classList.toggle('dark', isDarkMode);
  document.getElementById('darkmode').checked = isDarkMode;
}

function toggleDarkMode() {
  const isChecked = document.getElementById('darkmode').checked;
  localStorage.setItem('mode', isChecked ? 'light' : 'dark');
  applyDarkMode();
}

document.addEventListener('DOMContentLoaded', () => {
  applyDarkMode();
  document.getElementById('darkmode').addEventListener('change', toggleDarkMode);
});