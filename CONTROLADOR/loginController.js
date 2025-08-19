import { loginModel } from "../MODELO/loginModel.js";

export const loginController = {
    iniciarSesion(email, password) {
        if (loginModel.validarUsuario(email, password)) {
            localStorage.setItem("usuario", JSON.stringify({ email }));
            return true;
        }
        return false;
    },

    cerrarSesion() {
        localStorage.removeItem("usuario");
    },

    usuarioActivo() {
        return JSON.parse(localStorage.getItem("usuario"));
    }
};