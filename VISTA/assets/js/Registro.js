document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      Swal.fire({
        icon: 'success',
        title: '¡Usuario registrado con éxito!',
        text: 'Bienvenido a GOLD Wings.',
        confirmButtonText: 'Iniciar sesión',
        allowOutsideClick: false,
        allowEscapeKey: false
      }).then((result) => {
        if (result.isConfirmed) {
          form.reset();
          window.location.href = 'login.html';
        }
      });
    });
  }
});