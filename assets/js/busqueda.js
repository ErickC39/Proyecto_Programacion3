document.addEventListener('DOMContentLoaded', function() {
    // Botones de tipo de viaje y fechas
    const btnIda = document.getElementById('btn-ida');
    const btnIdaVuelta = document.getElementById('btn-ida-vuelta');
    const fechaRegreso = document.getElementById('fecha-regreso');

    if (btnIda && btnIdaVuelta && fechaRegreso) {
        btnIda.addEventListener('click', function() {
            btnIda.classList.add('active');
            btnIdaVuelta.classList.remove('active');
            fechaRegreso.disabled = true;
            fechaRegreso.value = '';
        });

        btnIdaVuelta.addEventListener('click', function() {
            btnIdaVuelta.classList.add('active');
            btnIda.classList.remove('active');
            fechaRegreso.disabled = false;
        });
    }

    // Cargar países en los selects usando REST Countries API
    const selectOrigen = document.getElementById('origen');
    const selectDestino = document.getElementById('destino');

    function cargarAeropuertos() {
        fetch('../assets/js/aeropuertos.json')
            .then(response => response.json())
            .then(data => {
                // Filtra solo los que tienen código IATA (code) y nombre
                const aeropuertos = data.filter(a => a.code && a.code.length === 3 && a.name);
                // Ordena por nombre
                aeropuertos.sort((a, b) => a.name.localeCompare(b.name));
                aeropuertos.forEach(aeropuerto => {
                    const texto = `${aeropuerto.name} (${aeropuerto.code}) - ${aeropuerto.country}`;
                    const option1 = document.createElement('option');
                    option1.value = aeropuerto.code;
                    option1.textContent = texto;
                    selectOrigen.appendChild(option1);

                    const option2 = document.createElement('option');
                    option2.value = aeropuerto.code;
                    option2.textContent = texto;
                    selectDestino.appendChild(option2);
                });
            })
            .catch(error => {
                console.error('Error al cargar aeropuertos:', error);
            });
    }

    if (selectOrigen && selectDestino) {
        cargarAeropuertos();
    }
});