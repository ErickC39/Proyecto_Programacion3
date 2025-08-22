// Importa el controlador de inicio de sesión para verificar el estado del usuario.
import { loginController } from "../../../CONTROLADOR/loginController.js";

// Espera a que el contenido del documento HTML se haya cargado completamente.
document.addEventListener("DOMContentLoaded", () => {
    // Obtiene la información del usuario activo.
    const usuario = loginController.usuarioActivo();
    // Obtiene una referencia al último div dentro del encabezado.
    const header = document.querySelector("header div:last-child");

    // Si hay un usuario activo, cambia el contenido del encabezado.
    if (usuario) {
        // Reemplaza los botones de inicio de sesión/registro con un icono de perfil.
        header.innerHTML = `
          <button id="btnPerfil" class="btn btn-outline-dark">
            <i class="fa-solid fa-user"></i>
          </button>
        `;
    }

    // Valida los botones de reserva.
    // Itera sobre todos los elementos con la clase "btn-reserva".
    document.querySelectorAll(".btn-reserva").forEach(btn => {
        // Añade un "escuchador" de eventos para cuando se hace clic en el botón.
        btn.addEventListener("click", (e) => {
            // Si no hay un usuario activo, evita la acción por defecto del botón.
            if (!loginController.usuarioActivo()) {
                e.preventDefault();
                // Muestra una alerta de SweetAlert.
                Swal.fire({
                    icon: "warning",
                    title: "Debes iniciar sesión",
                    text: "Inicia sesión para poder reservar",
                    confirmButtonText: "Iniciar Sesión"
                // Después de cerrar la alerta, redirige a la página de inicio de sesión.
                }).then(() => {
                    window.location.href = "login.html";
                });
            }
        });
    });
});