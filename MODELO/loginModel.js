export const loginModel = {
    usuarioDemo: {
        email: "ejemplo@ejemplo.com",
        password: "ejemplo"
    },

    validarUsuario(email, password) {
        return (
            email === this.usuarioDemo.email &&
            password === this.usuarioDemo.password
        );
    }
};