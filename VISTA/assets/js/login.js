import { loginController } from "../../../CONTROLADOR/loginController.js";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;

        if (loginController.iniciarSesion(email, password)) {
            Swal.fire({
                icon: "success",
                title: "Sesión iniciada",
                text: "Bienvenido a GOLD Wings",
                confirmButtonText: "Continuar"
            }).then(() => {
                window.location.href = "destinos.html";
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Usuario o contraseña incorrectos"
            });
        }
    });
});