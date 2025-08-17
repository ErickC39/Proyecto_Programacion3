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

    const templateVuelo = document.getElementById('template-vuelo');
    const templateRegreso = document.getElementById('template-vuelo-regreso');

    // Fechas mínimas
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

    // Contador pasajeros
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
                aeropuertos.sort((a, b) => a.country.localeCompare(b.country) || a.name.localeCompare(b.name));

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
    if (selectOrigen && selectDestino) cargarAeropuertos();

    // Evento buscar
    if (btnBuscarVuelo) {
        btnBuscarVuelo.addEventListener('click', function () {
            mostrarVuelos(selectOrigen.value, selectDestino.value);
        });
    }

    // Generar vuelo simulado
    function generarVueloSimulado(from, to) {
        let salida = new Date();
        if (fechaSalida && fechaSalida.value) {
            salida = new Date(fechaSalida.value + 'T' +
                String(Math.floor(Math.random() * 24)).padStart(2, '0') + ':' +
                String(Math.floor(Math.random() * 60)).padStart(2, '0'));
        } else {
            salida.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
        }

        const duracionHoras = Math.floor(Math.random() * 12) + 1;
        const llegada = new Date(salida.getTime() + duracionHoras * 60 * 60 * 1000);
        const price = (Math.random() * 1400 + 100).toFixed(2);
        const layover = Math.random() < 0.5;

        return { from, to, departure_time: salida.toISOString(), arrival_time: llegada.toISOString(), layover, price: parseFloat(price) };
    }

    // Mostrar vuelos
    function mostrarVuelos(origen, destino) {
        const dashboard = document.getElementById('vuelos-dashboard');
        dashboard.innerHTML = '';

        if (!origen || !destino) {
            Swal.fire({ icon: 'warning', title: 'Faltan datos', text: 'Selecciona aeropuerto de origen y destino' });
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
                    Swal.fire({ icon: 'error', title: 'Sin vuelos', text: 'No hay vuelos disponibles' });
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

                        const esIdaVuelta = btnIdaVuelta.classList.contains('active') && fechaRegreso && fechaRegreso.value;

                        // Clonamos plantilla
                        const card = templateVuelo.content.cloneNode(true);

                        // Mostrar etiqueta "Mejor precio" solo en el más barato
                        if (index === 0) {
                            card.querySelector('.badge-mejor-precio').classList.remove('d-none');
                        }

                        card.querySelector('.salida').textContent = `${new Date(vuelo.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(vuelo.departure_time).toLocaleDateString()}`;
                        card.querySelector('.origen').textContent = vuelo.from;
                        card.querySelector('.escala').textContent = escala;
                        card.querySelector('.duracion').textContent = `${duracionMinutos} min`;
                        card.querySelector('.llegada').textContent = `${new Date(vuelo.arrival_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(vuelo.arrival_time).toLocaleDateString()}`;
                        card.querySelector('.destino').textContent = vuelo.to;
                        card.querySelector('.precio').textContent = `USD ${vuelo.precioTotal.toFixed(2)}`;
                        if (cantidadPasajeros > 1) {
                            card.querySelector('.detalle-precio').textContent = `(${vuelo.price.toFixed(2)} x ${cantidadPasajeros})`;
                        }

                        // Si es ida y vuelta
                        if (esIdaVuelta) {
                            const vueloRegreso = generarVueloSimulado(vuelo.to, vuelo.from);
                            vueloRegreso.departure_time = new Date(fechaRegreso.value + 'T' +
                                String(Math.floor(Math.random() * 24)).padStart(2, '0') + ':' +
                                String(Math.floor(Math.random() * 60)).padStart(2, '0')).toISOString();
                            vueloRegreso.arrival_time = new Date(
                                new Date(vueloRegreso.departure_time).getTime() +
                                (Math.floor(Math.random() * 5) + 1) * 60 * 60 * 1000
                            ).toISOString();

                            const regresoCard = templateRegreso.content.cloneNode(true);
                            regresoCard.querySelector('.salida-regreso').textContent =
                                `${new Date(vueloRegreso.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(vueloRegreso.departure_time).toLocaleDateString()}`;
                            regresoCard.querySelector('.origen-regreso').textContent = vueloRegreso.from;
                            regresoCard.querySelector('.escala-regreso').textContent = vueloRegreso.layover ? 'Con escala' : 'Directo';
                            regresoCard.querySelector('.duracion-regreso').textContent =
                                `${Math.floor((new Date(vueloRegreso.arrival_time) - new Date(vueloRegreso.departure_time)) / 60000)} min`;
                            regresoCard.querySelector('.llegada-regreso').textContent =
                                `${new Date(vueloRegreso.arrival_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(vueloRegreso.arrival_time).toLocaleDateString()}`;
                            regresoCard.querySelector('.destino-regreso').textContent = vueloRegreso.to;

                            card.querySelector('.regreso').appendChild(regresoCard);
                        }

                        card.querySelector('.reservar-btn').addEventListener('click', () => {
                            Swal.fire({ icon: 'success', title: '¡Reserva confirmada!', text: '✈ Viaje reservado con éxito' });
                        });

                        dashboard.appendChild(card);
                    });
                });
            })
            .catch(error => {
                Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo cargar la información de vuelos.' });
                console.error('Error al cargar vuelos:', error);
            });
    }
});
