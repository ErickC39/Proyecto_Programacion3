// Espera a que el contenido del documento HTML se haya cargado completamente.
document.addEventListener("DOMContentLoaded", () => {
    // Obtiene una referencia al botón con el ID "btn-ver-maps".
    const btnVerMaps = document.getElementById("btn-ver-maps");

    // Verifica si el botón existe en la página.
    if (btnVerMaps) {
        // Añade un "escuchador" de eventos para cuando se haga clic en el botón.
        btnVerMaps.addEventListener("click", () => {
            // Muestra una ventana emergente (modal) usando SweetAlert2.
            Swal.fire({
                title: 'Ubicación GOLD Wings - Alajuela',
                // Define el contenido HTML del modal.
                html: `
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3934.3162753425084!2d-84.20880642410473!3d10.001261772884526!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa0fbac44a3f47d%3A0xf8e9f40be57d9e4b!2sAeropuerto%20Internacional%20Juan%20Santamar%C3%ADa!5e0!3m2!1ses!2scr!4v1692299999999!5m2!1ses!2scr"
                        width="100%" height="350" style="border:0;" allowfullscreen="" loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade">
                    </iframe>
                `,
                // Muestra un botón para cerrar el modal.
                showCloseButton: true,
                // Oculta el botón de confirmación.
                showConfirmButton: false,
                // Define el ancho del modal.
                width: "60%",
                // Asigna una clase CSS personalizada al modal.
                customClass: {
                    popup: 'rounded-4'
                }
            });
        });
    }
});