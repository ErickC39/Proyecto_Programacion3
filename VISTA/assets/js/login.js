// Importa el controlador de inicio de sesión para manejar la lógica de autenticación.
import { loginController } from "../../../CONTROLADOR/loginController.js";

// Espera a que el contenido del documento HTML se haya cargado completamente.
document.addEventListener("DOMContentLoaded", () => {
    // Obtiene una referencia al primer elemento de formulario en la página.
    const form = document.querySelector("form");

    // Añade un "escuchador" de eventos para cuando el formulario es enviado.
    form.addEventListener("submit", (e) => {
        // Evita el comportamiento por defecto del formulario (recargar la página).
        e.preventDefault();

        // Obtiene los valores de los campos de correo electrónico y contraseña.
        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;

        // Llama a la función `iniciarSesion` del controlador para intentar iniciar sesión.
        if (loginController.iniciarSesion(email, password)) {
            // Si el inicio de sesión es exitoso, muestra una alerta de éxito.
            Swal.fire({
                icon: "success",
                title: "Sesión iniciada",
                text: "Bienvenido a GOLD Wings",
                confirmButtonText: "Continuar"
            // Redirige al usuario a la página de destinos después de cerrar la alerta.
            }).then(() => {
                window.location.href = "destinos.html";
            });
        } else {
            // Si el inicio de sesión falla, muestra una alerta de error.
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Usuario o contraseña incorrectos"
            });
        }
    });
});