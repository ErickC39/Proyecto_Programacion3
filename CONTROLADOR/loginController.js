// Importa el modelo que maneja la lógica de autenticación del usuario.
import { loginModel } from "../MODELO/loginModel.js";

// Define un objeto de controlador para la gestión de inicio y cierre de sesión.
export const loginController = {

  /**
   * Función: iniciarSesion
   * Descripción: Intenta autenticar un usuario con un email y una contraseña.
   * Si la autenticación es exitosa, guarda el usuario en el almacenamiento local.
   * @param {string} email - El correo electrónico del usuario.
   * @param {string} password - La contraseña del usuario.
   * @returns {boolean} Retorna `true` si la sesión se inició correctamente, `false` en caso contrario.
   */
  iniciarSesion(email, password) {
    // Valida las credenciales del usuario usando el modelo.
    if (loginModel.validarUsuario(email, password)) {
      // Si las credenciales son correctas, guarda el usuario en el almacenamiento local.
      localStorage.setItem("usuario", JSON.stringify({ email }));
      return true;
    }
    // Si la validación falla, retorna falso.
    return false;
  },

  /**
   * Función: cerrarSesion
   * Descripción: Elimina el usuario del almacenamiento local para cerrar la sesión.
   */
  cerrarSesion() {
    localStorage.removeItem("usuario");
  },

  /**
   * Función: usuarioActivo
   * Descripción: Obtiene la información del usuario actualmente activo del almacenamiento local.
   * @returns {object|null} Retorna un objeto con los datos del usuario o `null` si no hay sesión activa.
   */
  usuarioActivo() {
    // Analiza y devuelve los datos del usuario almacenados en el almacenamiento local.
    return JSON.parse(localStorage.getItem("usuario"));
  }
};