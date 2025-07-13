document.addEventListener('DOMContentLoaded', function() {
    // Botones de tipo de viaje y fechas
    const btnIda = document.getElementById('btn-ida');
    const btnIdaVuelta = document.getElementById('btn-ida-vuelta');
    const fechaRegreso = document.getElementById('fecha-regreso');
    const fechaSalida = document.getElementById('fecha-salida');

    // Bloquear fechas pasadas en el input de fecha de salida
    if (fechaSalida) {
        const hoy = new Date();
        const yyyy = hoy.getFullYear();
        const mm = String(hoy.getMonth() + 1).padStart(2, '0');
        const dd = String(hoy.getDate()).padStart(2, '0');
        const fechaMin = `${yyyy}-${mm}-${dd}`;
        fechaSalida.setAttribute('min', fechaMin);

        // Opcional: cuando cambia la fecha de salida, la de regreso no puede ser menor
        if (fechaRegreso) {
            fechaSalida.addEventListener('change', function() {
                fechaRegreso.min = fechaSalida.value;
                if (fechaRegreso.value < fechaSalida.value) {
                    fechaRegreso.value = fechaSalida.value;
                }
            });
        }
    }

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

    // Cargar aeropuertos principales en los selects
    const selectOrigen = document.getElementById('origen');
    const selectDestino = document.getElementById('destino');

    function cargarAeropuertos() {
        fetch('../assets/js/paises_aeropuertos.json')
            .then(response => response.json())
            .then(data => {
                const aeropuertos = data.filter(a => a.code && a.code.length === 3 && a.name && a.country);
                aeropuertos.sort((a, b) => {
                    const paisA = a.country.toLowerCase();
                    const paisB = b.country.toLowerCase();
                    if (paisA < paisB) return -1;
                    if (paisA > paisB) return 1;
                    return a.name.localeCompare(b.name);
                });
                aeropuertos.forEach((aeropuerto, idx) => {
                    const texto = `${idx + 1}. ${aeropuerto.country} - ${aeropuerto.name} (${aeropuerto.code})`;
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

    // Dashboard de vuelos simulados
    const btnBuscarVuelo = document.getElementById('buscar-vuelo');
    if (btnBuscarVuelo) {
        btnBuscarVuelo.addEventListener('click', function() {
            const origen = selectOrigen.value;
            const destino = selectDestino.value;
            mostrarVuelos(origen, destino);
        });
    }

    // Función para simular vuelo con fecha/hora/precio aleatorios
    function generarVueloSimulado(from, to) {
        // Si hay fecha de salida seleccionada, úsala; si no, usa hoy
        let salida = new Date();
        if (fechaSalida && fechaSalida.value) {
            salida = new Date(fechaSalida.value + 'T' + String(Math.floor(Math.random() * 24)).padStart(2, '0') + ':' + String(Math.floor(Math.random() * 60)).padStart(2, '0'));
        } else {
            salida.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
        }

        // Duración entre 1 y 12 horas
        const duracionHoras = Math.floor(Math.random() * 12) + 1;
        const llegada = new Date(salida.getTime() + duracionHoras * 60 * 60 * 1000);

        // Precio aleatorio entre $100 y $1500
        const price = (Math.random() * 1400 + 100).toFixed(2);

        // Escala aleatoria
        const layover = Math.random() < 0.5;

        return {
            from,
            to,
            departure_time: salida.toISOString(),
            arrival_time: llegada.toISOString(),
            layover,
            price: parseFloat(price)
        };
    }

    function mostrarVuelos(origen, destino) {
        const dashboard = document.getElementById('vuelos-dashboard');
        dashboard.innerHTML = '';

        if (!origen || !destino) {
            dashboard.innerHTML = '<div class="alert alert-warning">Selecciona aeropuerto de origen y destino.</div>';
            return;
        }

        fetch('../assets/js/viaje_paises.json')
            .then(response => response.json())
            .then(data => {
                // Busca la ruta
                const rutas = data.filter(v =>
                    v.from && v.to &&
                    v.from.trim().toUpperCase() === origen.trim().toUpperCase() &&
                    v.to.trim().toUpperCase() === destino.trim().toUpperCase()
                );

                if (rutas.length === 0) {
                    dashboard.innerHTML = '<div class="alert alert-danger">No hay vuelos disponibles</div>';
                    return;
                }

                // Genera vuelos simulados para cada ruta encontrada
                rutas.forEach(ruta => {
                    const vuelo = generarVueloSimulado(ruta.from, ruta.to);
                    const escala = vuelo.layover ? 'Con escala' : 'Directo';
                    const card = document.createElement('div');
                    card.className = 'card mb-3';
                    card.innerHTML = `
                        <div class="card-body">
                            <div><strong>Salida:</strong> ${new Date(vuelo.departure_time).toLocaleString()}</div>
                            <div><strong>${escala}</strong></div>
                            <div><strong>Llegada:</strong> ${new Date(vuelo.arrival_time).toLocaleString()}</div>
                            <div><strong>Precio:</strong> $${vuelo.price.toFixed(2)}</div>
                        </div>
                    `;
                    dashboard.appendChild(card);
                });
            })
            .catch(error => {
                dashboard.innerHTML = '<div class="alert alert-danger">No se pudo cargar la información de vuelos.</div>';
                console.error('Error al cargar vuelos:', error);
            });
    }
});