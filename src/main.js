const viewport = document.querySelector("[data-hero-viewport]");
const progressBar = document.querySelector("[data-hero-progress]");
const navbarLogo = document.querySelector(".navbar-logo");
const navbarMenu = document.querySelector(".navbar-menu");
const logoTagline = document.querySelector(".navbar-logo-tagline");

const LIGHT_BG_IMAGES = new Set([1, 5]);
const WHITE_TAGLINE_IMAGES = new Set([0, 3]);

let isDragging = false;
let activePointerId = null;
let dragStartX = 0;
let scrollStartX = 0;

function getMaxScroll() {
  return Math.max(0, viewport.scrollWidth - viewport.clientWidth);
}

function getImageIndexAt(viewportX) {
  const cellWidth = viewport.clientWidth / 2;
  const trackX = viewport.scrollLeft + viewportX;
  const index = Math.floor(trackX / cellWidth);

  return Math.max(0, Math.min(5, index));
}

function updateNavbarColors() {
  if (!navbarLogo || !navbarMenu || !viewport) return;

  const logoX = navbarLogo.offsetLeft + navbarLogo.offsetWidth / 2;
  const menuX = navbarMenu.offsetLeft + navbarMenu.offsetWidth / 2;

  navbarLogo.classList.toggle("is-dark-text", LIGHT_BG_IMAGES.has(getImageIndexAt(logoX)));
  navbarMenu.classList.toggle("is-dark-text", LIGHT_BG_IMAGES.has(getImageIndexAt(menuX)));

  if (logoTagline) {
    const taglineRect = logoTagline.getBoundingClientRect();
    const taglineX = taglineRect.left + taglineRect.width / 2;
    logoTagline.classList.toggle(
      "is-light-text",
      WHITE_TAGLINE_IMAGES.has(getImageIndexAt(taglineX))
    );
  }
}

function updateProgress() {
  const max = getMaxScroll();
  const ratio = max === 0 ? 0 : viewport.scrollLeft / max;
  progressBar.style.width = `${ratio * 100}%`;
  updateNavbarColors();
}

function onPointerDown(event) {
  if (event.pointerType === "mouse" && event.button !== 0) return;

  isDragging = true;
  activePointerId = event.pointerId;
  dragStartX = event.clientX;
  scrollStartX = viewport.scrollLeft;

  viewport.classList.add("is-dragging");
  viewport.setPointerCapture(event.pointerId);
}

function onPointerMove(event) {
  if (!isDragging || event.pointerId !== activePointerId) return;

  const delta = event.clientX - dragStartX;
  viewport.scrollLeft = scrollStartX - delta;
  updateProgress();
}

function endDrag(event) {
  if (!isDragging || event.pointerId !== activePointerId) return;

  isDragging = false;
  activePointerId = null;
  viewport.classList.remove("is-dragging");
}

function onWheel(event) {
  const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);

  if (!horizontal) return;

  event.preventDefault();
  viewport.scrollLeft += event.deltaX;
  updateProgress();
}

viewport.addEventListener("pointerdown", onPointerDown);
viewport.addEventListener("pointermove", onPointerMove);
viewport.addEventListener("pointerup", endDrag);
viewport.addEventListener("pointercancel", endDrag);
viewport.addEventListener("scroll", updateProgress, { passive: true });
viewport.addEventListener("wheel", onWheel, { passive: false });

window.addEventListener("resize", () => {
  updateProgress();
  updateNavbarColors();
});

updateProgress();
updateNavbarColors();
