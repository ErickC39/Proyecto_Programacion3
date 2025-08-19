import { loginController } from "../../../CONTROLADOR/loginController.js";

document.addEventListener("DOMContentLoaded", () => {
    const usuario = loginController.usuarioActivo();
    const header = document.querySelector("header div:last-child");

    if (usuario) {
        // Reemplazar botones por icono de perfil
        header.innerHTML = `
          <button id="btnPerfil" class="btn btn-outline-dark">
            <i class="fa-solid fa-user"></i>
          </button>
        `;
    }

    // Validar botones de reserva
    document.querySelectorAll(".btn-reserva").forEach(btn => {
        btn.addEventListener("click", (e) => {
            if (!loginController.usuarioActivo()) {
                e.preventDefault();
                Swal.fire({
                    icon: "warning",
                    title: "Debes iniciar sesión",
                    text: "Inicia sesión para poder reservar",
                    confirmButtonText: "Iniciar Sesión"
                }).then(() => {
                    window.location.href = "login.html";
                });
            }
        });
    });
});