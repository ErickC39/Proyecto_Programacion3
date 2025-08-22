import { loginController } from "../../../CONTROLADOR/loginController.js";

document.addEventListener("DOMContentLoaded", () => {
    const usuario = loginController.usuarioActivo();
    const header = document.querySelector("header div:last-child");

    if (!header) return;

    if (usuario) {
        // Mostrar ícono de perfil
        header.innerHTML = `
          <button id="btnPerfil" class="btn btn-outline-dark">
            <i class="fa-solid fa-user"></i>
          </button>
        `;

        // Detectar en que ubicacion se abre el perfil
        const usuarioPath = window.location.pathname.includes("/pages/")
            ? "usuario.html"             // estamos dentro de las paginas
            : "VISTA/pages/usuario.html"; // estamos en index

        // Redirigir al área de usuario al hacer clic
        const btnPerfil = document.getElementById("btnPerfil");
        btnPerfil.addEventListener("click", () => {
            window.location.href = usuarioPath;
        });
    }
});
