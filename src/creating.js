const navbarLogo = document.querySelector(".navbar-logo");
const navbarMenu = document.querySelector(".navbar-menu");
const logoTagline = document.querySelector(".navbar-logo-tagline");

function updateNavbarColors() {
  if (!navbarLogo || !navbarMenu) return;

  navbarLogo.classList.remove("is-dark-text");
  navbarMenu.classList.remove("is-dark-text");

  if (logoTagline) {
    logoTagline.classList.add("is-light-text");
  }
}

window.addEventListener("resize", updateNavbarColors);
updateNavbarColors();
