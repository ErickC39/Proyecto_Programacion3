// Define un objeto de modelo para la gestión de datos y lógica de autenticación.
export const loginModel = {
  
  // Objeto que contiene las credenciales de un usuario de demostración.
  usuarioDemo: {
    email: "ejemplo@ejemplo.com",
    password: "ejemplo"
  },

  /**
   * Función: validarUsuario
   * Descripción: Comprueba si las credenciales proporcionadas coinciden con las del usuario de demostración.
   * @param {string} email - El correo electrónico a validar.
   * @param {string} password - La contraseña a validar.
   * @returns {boolean} Retorna `true` si el email y la contraseña son correctos, `false` en caso contrario.
   */
  validarUsuario(email, password) {
    // Compara el email y la contraseña dados con las credenciales del usuario de demostración.
    return (
      email === this.usuarioDemo.email &&
      password === this.usuarioDemo.password
    );
  }
};