import { loginController } from "../../../CONTROLADOR/loginController.js";

document.addEventListener("DOMContentLoaded", () => {
    const usuario = loginController.usuarioActivo();
    const header = document.querySelector("header div:last-child");

    if (usuario) {
        header.innerHTML = `
          <button id="btnPerfil" class="btn btn-outline-dark">
            <i class="fa-solid fa-user"></i>
          </button>
        `;
    }
});