  const menuIcon = document.getElementById('menu-icon');
  const sideMenu = document.getElementById('side-menu');

  menuIcon.addEventListener('click', () => {
    sideMenu.classList.toggle('active');
  });