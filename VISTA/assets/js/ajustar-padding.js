function ajustarPadding() {
  const header = document.querySelector("header");
  const nav = document.querySelector(".quick-nav");
  const body = document.body;

  if (header && nav) {
    const alturaTotal = header.offsetHeight + nav.offsetHeight;
    body.style.paddingTop = alturaTotal + "px";
  }
}

// Ejecuta al cargar y al redimensionar
window.addEventListener("load", ajustarPadding);
window.addEventListener("resize", ajustarPadding);
