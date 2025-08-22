// Este script resalta en la barra de navegación el enlace correspondiente a la página actual.

// Espera a que el contenido del documento HTML se haya cargado completamente.
document.addEventListener("DOMContentLoaded", function () {
  // Obtiene todos los enlaces dentro de la barra de navegación rápida.
  const enlaces = document.querySelectorAll(".quick-nav a");
  // Obtiene el nombre del archivo de la página actual, por ejemplo, "index.html".
  const urlActual = window.location.pathname.split("/").pop();

  // Itera sobre cada uno de los enlaces.
  enlaces.forEach(enlace => {
    // Obtiene el valor del atributo "href" de cada enlace.
    const href = enlace.getAttribute("href");
    // Compara la página actual con el destino del enlace. Si coinciden o si la URL está vacía y el destino es "index.html",
    // añade la clase "activo".
    if (urlActual === href || (urlActual === "" && href === "index.html")) {
      enlace.classList.add("activo");
    }
  });
});