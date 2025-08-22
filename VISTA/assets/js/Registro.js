// Espera a que el contenido del documento HTML se haya cargado completamente.
document.addEventListener('DOMContentLoaded', function() {
  // Obtiene el primer formulario de la página.
  const form = document.querySelector('form');
  
  // Verifica si el formulario existe.
  if (form) {
    // Agrega un "escuchador" de eventos para cuando se envíe el formulario.
    form.addEventListener('submit', function(e) {
      // Evita que el formulario se envíe de la forma tradicional, previniendo la recarga de la página.
      e.preventDefault();
      
      // Muestra una alerta de éxito con SweetAlert2 para informar al usuario que se registró.
      Swal.fire({
        icon: 'success',
        title: '¡Usuario registrado con éxito!',
        text: 'Bienvenido a GOLD Wings.',
        confirmButtonText: 'Iniciar sesión',
        allowOutsideClick: false,
        allowEscapeKey: false
      }).then((result) => {
        // Después de que el usuario haga clic en el botón, el formulario se reinicia y se redirige a la página de inicio de sesión.
        if (result.isConfirmed) {
          form.reset();
          window.location.href = 'login.html';
        }
      });
    });
  }
});