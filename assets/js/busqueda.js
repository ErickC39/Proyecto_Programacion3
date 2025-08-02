document.addEventListener('DOMContentLoaded', function () {
    const btnIda = document.getElementById('btn-ida');
    const btnIdaVuelta = document.getElementById('btn-ida-vuelta');
    const fechaRegreso = document.getElementById('fecha-regreso');
    const fechaSalida = document.getElementById('fecha-salida');

    const selectOrigen = document.getElementById('origen');
    const selectDestino = document.getElementById('destino');
    const btnBuscarVuelo = document.getElementById('buscar-vuelo');

    const inputPasajeros = document.getElementById('pasajeros');
    const btnIncrementar = document.getElementById('incrementar');
    const btnDecrementar = document.getElementById('decrementar');

    // Fechas mínimas y lógica ida/vuelta
    if (fechaSalida) {
        const hoy = new Date();
        const yyyy = hoy.getFullYear();
        const mm = String(hoy.getMonth() + 1).padStart(2, '0');
        const dd = String(hoy.getDate()).padStart(2, '0');
        fechaSalida.setAttribute('min', `${yyyy}-${mm}-${dd}`);

        fechaSalida.addEventListener('change', function () {
            if (fechaRegreso) {
                fechaRegreso.min = fechaSalida.value;
                if (fechaRegreso.value < fechaSalida.value) {
                    fechaRegreso.value = fechaSalida.value;
                }
            }
        });
    }

    if (btnIda && btnIdaVuelta && fechaRegreso) {
        btnIda.addEventListener('click', () => {
            btnIda.classList.add('active');
            btnIdaVuelta.classList.remove('active');
            fechaRegreso.disabled = true;
            fechaRegreso.value = '';
        });

        btnIdaVuelta.addEventListener('click', () => {
            btnIdaVuelta.classList.add('active');
            btnIda.classList.remove('active');
            fechaRegreso.disabled = false;
        });
    }

    // Contador de pasajeros
    if (inputPasajeros && btnIncrementar && btnDecrementar) {
        btnIncrementar.addEventListener('click', () => {
            inputPasajeros.value = parseInt(inputPasajeros.value) + 1;
        });

        btnDecrementar.addEventListener('click', () => {
            if (parseInt(inputPasajeros.value) > 1) {
                inputPasajeros.value = parseInt(inputPasajeros.value) - 1;
            }
        });
    }

    // Cargar aeropuertos
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
            .catch(error => console.error('Error al cargar aeropuertos:', error));
    }

    if (selectOrigen && selectDestino) {
        cargarAeropuertos();
    }

    // Evento de búsqueda
    if (btnBuscarVuelo) {
        btnBuscarVuelo.addEventListener('click', function () {
            const origen = selectOrigen.value;
            const destino = selectDestino.value;
            mostrarVuelos(origen, destino);
        });
    }

    // Vuelo aleatorio simulado
    function generarVueloSimulado(from, to) {
        let salida = new Date();
        if (fechaSalida && fechaSalida.value) {
            salida = new Date(fechaSalida.value + 'T' + String(Math.floor(Math.random() * 24)).padStart(2, '0') + ':' + String(Math.floor(Math.random() * 60)).padStart(2, '0'));
        } else {
            salida.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
        }

        const duracionHoras = Math.floor(Math.random() * 12) + 1;
        const llegada = new Date(salida.getTime() + duracionHoras * 60 * 60 * 1000);
        const price = (Math.random() * 1400 + 100).toFixed(2);
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

    // Mostrar resultados
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
                const rutas = data.filter(v =>
                    v.from && v.to &&
                    v.from.trim().toUpperCase() === origen.trim().toUpperCase() &&
                    v.to.trim().toUpperCase() === destino.trim().toUpperCase()
                );

                if (rutas.length === 0) {
                    dashboard.innerHTML = '<div class="alert alert-danger">No hay vuelos disponibles</div>';
                    return;
                }

                const cantidadPasajeros = parseInt(inputPasajeros.value) || 1;

                rutas.forEach(ruta => {
                    const cantidadVuelos = Math.floor(Math.random() * 3) + 3;
                    const vuelosSimulados = [];

                    for (let i = 0; i < cantidadVuelos; i++) {
                        const vuelo = generarVueloSimulado(ruta.from, ruta.to);
                        vuelo.precioTotal = vuelo.price * cantidadPasajeros;
                        vuelosSimulados.push(vuelo);
                    }

                    vuelosSimulados.sort((a, b) => a.precioTotal - b.precioTotal);

                    vuelosSimulados.forEach((vuelo, index) => {
                        const escala = vuelo.layover ? 'Con escala' : 'Directo';
                        const duracionMinutos = Math.floor((new Date(vuelo.arrival_time) - new Date(vuelo.departure_time)) / 60000);
                        const mejorPrecioEtiqueta = index === 0
                            ? `<div class="badge-mejor-precio">$ Mejor precio</div>`
                            : '';

                        // Ida y vuelta
                        const esIdaVuelta = btnIdaVuelta.classList.contains('active') && fechaRegreso && fechaRegreso.value;
                        let regresoHTML = '';
                        if (esIdaVuelta) {
                            const vueloRegreso = generarVueloSimulado(vuelo.to, vuelo.from);
                            vueloRegreso.departure_time = new Date(fechaRegreso.value + 'T' + String(Math.floor(Math.random() * 24)).padStart(2, '0') + ':' + String(Math.floor(Math.random() * 60)).padStart(2, '0')).toISOString();
                            vueloRegreso.arrival_time = new Date(new Date(vueloRegreso.departure_time).getTime() + (Math.floor(Math.random() * 5) + 1) * 60 * 60 * 1000).toISOString();
                            const duracionRegreso = Math.floor((new Date(vueloRegreso.arrival_time) - new Date(vueloRegreso.departure_time)) / 60000);
                            const escalaRegreso = vueloRegreso.layover ? 'Con escala' : 'Directo';

                            regresoHTML = `
                                <hr>
                                <div class="row align-items-center mt-3">
                                    <div class="col-md-3 text-center">
                                        <div class="hora fw-bold">${new Date(vueloRegreso.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        <div class="iata text-muted">${vueloRegreso.from}</div>
                                    </div>
                                    <div class="col-md-4 text-center">
                                        <div class="text-primary fw-semibold">${escalaRegreso}</div>
                                        <div class="duracion text-muted">${duracionRegreso} min</div>
                                        <div class="ruta-icono">
                                            <span class="dot"></span>
                                            <i class="fa-solid fa-plane mx-2"></i>
                                            <span class="dot"></span>
                                        </div>
                                    </div>
                                    <div class="col-md-2 text-center">
                                        <div class="hora fw-bold">${new Date(vueloRegreso.arrival_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        <div class="iata text-muted">${vueloRegreso.to}</div>
                                    </div>
                                    <div class="col-md-3 text-end">
                                        <div class="text-muted small">Regreso</div>
                                    </div>
                                </div>
                            `;
                        }

                        const card = document.createElement('div');
                        card.className = 'resultado-vuelo mb-3 position-relative shadow-sm p-3 rounded bg-white';

                        card.innerHTML = `
                            ${mejorPrecioEtiqueta}
                            <div class="row align-items-center">
                                <div class="col-md-3 text-center">
                                    <div class="hora fw-bold">${new Date(vuelo.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    <div class="iata text-muted">${vuelo.from}</div>
                                </div>
                                <div class="col-md-4 text-center">
                                    <div class="text-primary fw-semibold">${escala}</div>
                                    <div class="duracion text-muted">${duracionMinutos} min</div>
                                    <div class="ruta-icono">
                                        <span class="dot"></span>
                                        <i class="fa-solid fa-plane mx-2"></i>
                                        <span class="dot"></span>
                                    </div>
                                </div>
                                <div class="col-md-2 text-center">
                                    <div class="hora fw-bold">${new Date(vuelo.arrival_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    <div class="iata text-muted">${vuelo.to}</div>
                                </div>
                                <div class="col-md-3 text-end">
                                    <div class="text-muted small">Desde</div>
                                    <div class="precio fw-bold">USD ${vuelo.precioTotal.toFixed(2)}</div>
                                    ${cantidadPasajeros > 1 ? `<div class="small text-muted">($${vuelo.price.toFixed(2)} x ${cantidadPasajeros})</div>` : ''}
                                    <button class="btn btn-sm btn-success mt-2 reservar-btn">Reservar viaje</button>
                                </div>
                            </div>
                            ${regresoHTML}
                        `;

                        const btnReservar = card.querySelector('.reservar-btn');
                        btnReservar.addEventListener('click', () => {
                            alert('✈ Viaje reservado con éxito');
                        });

                        dashboard.appendChild(card);
                    });
                });
            })
            .catch(error => {
                dashboard.innerHTML = '<div class="alert alert-danger">No se pudo cargar la información de vuelos.</div>';
                console.error('Error al cargar vuelos:', error);
            });
    }
});
