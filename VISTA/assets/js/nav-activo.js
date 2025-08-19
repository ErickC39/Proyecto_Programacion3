// Este script resalta en la barra de navegación el enlace correspondiente a la página actual

document.addEventListener("DOMContentLoaded", function () {
  const enlaces = document.querySelectorAll(".quick-nav a"); // todos los enlaces del menú
  const urlActual = window.location.pathname.split("/").pop(); // obtiene la ruta de la página actual

  enlaces.forEach(enlace => {
    const href = enlace.getAttribute("href"); // obtiene el destino del enlace
    if (urlActual === href || (urlActual === "" && href === "index.html")) {
      enlace.classList.add("activo"); // agrega la clase "activo" al enlace que coincide
    }
  });
});