const hoverMenuSound = new Audio('../../static/sound/select_003.ogg');
const clickMenuSound = new Audio('../../static/sound/click_003.ogg');

document.querySelectorAll('#side-menu ul li').forEach(item => {
  item.addEventListener('mouseenter', () => {
    hoverMenuSound.currentTime = 0;
    hoverMenuSound.play();
  });

  item.addEventListener('click', () => {
    clickMenuSound.currentTime = 0;
    clickMenuSound.play();
  });
});
