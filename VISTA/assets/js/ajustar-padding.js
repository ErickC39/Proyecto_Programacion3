/**
 * Función: ajustarPadding
 * Descripción: Ajusta el `padding-top` del cuerpo de la página.
 * Esto asegura que el contenido no quede oculto bajo el encabezado y la barra de navegación.
 */
function ajustarPadding() {
  // Obtiene el elemento del encabezado.
  const header = document.querySelector("header");
  // Obtiene el elemento de la barra de navegación.
  const nav = document.querySelector(".quick-nav");
  // Obtiene el elemento del cuerpo del documento.
  const body = document.body;

  // Verifica que ambos elementos (header y nav) existan.
  if (header && nav) {
    // Calcula la altura combinada del encabezado y la barra de navegación.
    const alturaTotal = header.offsetHeight + nav.offsetHeight;
    // Establece el `padding-top` del cuerpo de la página para que sea igual a la altura total.
    body.style.paddingTop = alturaTotal + "px";
  }
}

// Llama a la función `ajustarPadding` cuando la página se carga.
window.addEventListener("load", ajustarPadding);
// Llama a la función `ajustarPadding` cada vez que se redimensiona la ventana.
window.addEventListener("resize", ajustarPadding);