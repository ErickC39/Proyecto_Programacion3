// Importa el controlador de inicio de sesión para verificar si hay un usuario activo.
import { loginController } from "../../../CONTROLADOR/loginController.js";

// Espera a que el contenido del documento HTML se haya cargado completamente.
document.addEventListener("DOMContentLoaded", () => {
    // Obtiene la información del usuario activo.
    const usuario = loginController.usuarioActivo();
    // Selecciona el último div dentro del elemento 'header'.
    const header = document.querySelector("header div:last-child");

    // Si el elemento 'header' no existe, la función se detiene.
    if (!header) return;

    // Si un usuario está logueado, se realizan las siguientes acciones.
    if (usuario) {
        // Muestra un ícono de perfil.
        header.innerHTML = `
          <button id="btnPerfil" class="btn btn-outline-dark">
            <i class="fa-solid fa-user"></i>
          </button>
        `;

        // Determina la ruta correcta a la página de usuario según la ubicación actual.
        const usuarioPath = window.location.pathname.includes("/pages/")
            ? "usuario.html"
            : "VISTA/pages/usuario.html";

        // Redirige al usuario a su página de perfil cuando se hace clic en el botón.
        const btnPerfil = document.getElementById("btnPerfil");
        btnPerfil.addEventListener("click", () => {
            window.location.href = usuarioPath;
        });
    }
});