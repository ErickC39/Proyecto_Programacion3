document.addEventListener("DOMContentLoaded", () => {
    const btnVerMaps = document.getElementById("btn-ver-maps");

    if (btnVerMaps) {
        btnVerMaps.addEventListener("click", () => {
            Swal.fire({
                title: 'Ubicación GOLD Wings - Alajuela',
                html: `
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3934.3162753425084!2d-84.20880642410473!3d10.001261772884526!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa0fbac44a3f47d%3A0xf8e9f40be57d9e4b!2sAeropuerto%20Internacional%20Juan%20Santamar%C3%ADa!5e0!3m2!1ses!2scr!4v1692299999999!5m2!1ses!2scr"
                        width="100%" height="350" style="border:0;" allowfullscreen="" loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade">
                    </iframe>
                `,
                showCloseButton: true,
                showConfirmButton: false,
                width: "60%",
                customClass: {
                    popup: 'rounded-4'
                }
            });
        });
    }
});
