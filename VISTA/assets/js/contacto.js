// Espera a que el contenido del documento HTML se haya cargado completamente.
document.addEventListener("DOMContentLoaded", function () {
    // Obtiene una referencia al formulario de contacto y al botón de política.
    const form = document.getElementById("contactForm");
    const politicaBtn = document.getElementById("politicaBtn");

    // --- Validación del formulario ---

    // Añade un "escuchador" de eventos para cuando el formulario es enviado.
    form.addEventListener("submit", function (e) {
        // Evita el comportamiento por defecto del formulario (recargar la página).
        e.preventDefault();

        // Obtiene los valores de los campos de entrada y elimina los espacios en blanco al inicio y final.
        const nombre = document.getElementById("nombre").value.trim();
        const correo = document.getElementById("correo").value.trim();
        const motivo = document.getElementById("motivo").value.trim();
        const mensaje = document.getElementById("mensaje").value.trim();

        // Comprueba si alguno de los campos obligatorios está vacío.
        if (!nombre || !correo || !motivo || !mensaje) {
            // Muestra una alerta de error si hay campos vacíos.
            Swal.fire({
                icon: "error",
                title: "Campos vacíos",
                text: "Por favor, completa todos los campos obligatorios.",
                confirmButtonColor: "var(--color-secondary)"
            });
            // Detiene la ejecución de la función.
            return;
        }

        // Muestra una alerta de éxito si todos los campos están llenos.
        Swal.fire({
            icon: "success",
            title: "¡Enviado!",
            text: "La información fue enviada exitosamente.",
            confirmButtonColor: "var(--color-primary)"
        });

        // Reinicia el formulario, borrando todos los campos.
        form.reset();
    });

    // --- Popup de política de privacidad ---

    // Añade un "escuchador" de eventos para cuando se hace clic en el botón de política.
    politicaBtn.addEventListener("click", function () {
        // Muestra una ventana emergente (modal) con la política de privacidad.
        Swal.fire({
            title: "Política de Privacidad",
            // Inserta el contenido HTML de la política de privacidad.
            html: `
                <p><strong>Política de Privacidad – Proyecto GOLD Wings</strong></p>
                <p>Este sitio web y su contenido forman parte de un proyecto académico desarrollado con fines <strong>exclusivamente educativos</strong> dentro del curso <strong>Programación 3</strong> de la <strong>Universidad Tecnológica Costarricense (UTC)</strong>.</p>
                
                <p>La información solicitada en este formulario de contacto es <strong>ficticia</strong> y no será almacenada, procesada ni compartida con terceros. Todos los datos ingresados por los usuarios se consideran de carácter <strong>simulado</strong> para cumplir con los objetivos del proyecto universitario.</p>
                
                <h5>Alcance del Proyecto</h5>
                <ul style="text-align:left">
                    <li>Este sitio corresponde a un trabajo académico y no representa a ninguna empresa real.</li>
                    <li>La marca <em>GOLD Wings</em> es ficticia y no tiene relación con compañías registradas.</li>
                    <li>Los formularios y funciones han sido diseñados únicamente con fines de aprendizaje.</li>
                </ul>
                
                <h5>Datos Personales</h5>
                <p>Los campos como nombre, correo electrónico o mensajes se utilizan solo como <strong>ejemplo académico</strong> y no serán almacenados ni enviados a servidores externos.</p>
                
                <h5>Uso Educativo</h5>
                <p>Este sitio se emplea para la práctica de integración de <em>HTML5, CSS3, Bootstrap, JavaScript y SweetAlert2</em>, simulando un sistema real con fines de exposición.</p>
                
                <h5>Derechos y Limitaciones</h5>
                <p>Este proyecto no tiene validez legal, comercial ni contractual. No se generarán reservas reales ni respuestas oficiales.</p>
            `,
            icon: "info",
            confirmButtonText: "Cerrar",
            confirmButtonColor: "var(--color-primary)",
            width: "60%",
        });
    });
});