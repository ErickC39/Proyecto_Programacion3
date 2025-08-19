document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contactForm");
    const politicaBtn = document.getElementById("politicaBtn");

    // Validación del formulario
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const correo = document.getElementById("correo").value.trim();
        const motivo = document.getElementById("motivo").value.trim();
        const mensaje = document.getElementById("mensaje").value.trim();

        if (!nombre || !correo || !motivo || !mensaje) {
            Swal.fire({
                icon: "error",
                title: "Campos vacíos",
                text: "Por favor, completa todos los campos obligatorios.",
                confirmButtonColor: "var(--color-secondary)"
            });
            return;
        }

        // Mensaje de éxito
        Swal.fire({
            icon: "success",
            title: "¡Enviado!",
            text: "La información fue enviada exitosamente.",
            confirmButtonColor: "var(--color-primary)"
        });

        form.reset();
    });

    // Popup de política de privacidad
    politicaBtn.addEventListener("click", function () {
        Swal.fire({
            title: "Política de Privacidad",
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
