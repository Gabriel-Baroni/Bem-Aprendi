
// -----------------MENU LATERAL--------------------
const hoverMenuSound = new Audio('../static/sound/select_003.ogg');
const clickMenuSound = new Audio('../static/sound/click_003.ogg');

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

// --------------ÁUDIOS DO POP-UP----------------
const closePopupSound = new Audio('static/sound/error_008.ogg');
const clickButtonSound = new Audio('static/sound/confirmation_004.ogg');
const HoverButtonSound = new Audio('static/sound/select_005.ogg');
document.querySelectorAll(".close-btn").forEach(btn => {
  btn.addEventListener('click', () => {
    closePopupSound.currentTime = 0;
    closePopupSound.volume = 1.0;
    closePopupSound.play();
  });
});
document.querySelectorAll('#botao-popup').forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    HoverButtonSound.currentTime = 0;
    HoverButtonSound.volume = 1.0;
    HoverButtonSound.play();
  });
  btn.addEventListener('click', () => {
    clickButtonSound.currentTime = 0;
    clickButtonSound.play();
  });
});
