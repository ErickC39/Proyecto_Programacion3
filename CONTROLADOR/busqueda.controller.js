import BusquedaModel from '../MODELO/busqueda.model.js';

document.addEventListener('DOMContentLoaded', async function () {
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
    const dashboard = document.getElementById('vuelos-dashboard');

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

    // Cargar aeropuertos desde API
    async function cargarAeropuertos() {
    try {
        let aeropuertos = await BusquedaModel.obtenerAeropuertos();
        // Ordenar alfabéticamente por nombre de país
        aeropuertos.sort((a, b) => a.country.localeCompare(b.country));

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

            // autocompletar si se carga desde destinos
            const params = new URLSearchParams(window.location.search);
            const destinoParam = params.get("destino");

            if (destinoParam) {
                const opcionCostaRica = [...selectOrigen.options].find(opt => opt.value === "SJO");
                if (opcionCostaRica) selectOrigen.value = opcionCostaRica.value;
                const opcionDestino = [...selectDestino.options].find(opt => opt.value === destinoParam);
                if (opcionDestino) selectDestino.value = opcionDestino.value;
            }
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar los aeropuertos.' });
        }
    }
    if (selectOrigen && selectDestino) cargarAeropuertos();

    // Evento buscar
    if (btnBuscarVuelo) {
        btnBuscarVuelo.addEventListener('click', async function () {
            await mostrarVuelos(selectOrigen.value, selectDestino.value);
        });
    }

    // Mostrar vuelos usando la API
    async function mostrarVuelos(origen, destino) {
        dashboard.innerHTML = '';

        if (!origen || !destino) {
            Swal.fire({ icon: 'warning', title: 'Faltan datos', text: 'Selecciona aeropuerto de origen y destino' });
            return;
        }

        try {
            const cantidadPasajeros = parseInt(inputPasajeros.value) || 1;
            const tipoViaje = btnIdaVuelta.classList.contains('active') ? 'ida-vuelta' : 'ida';
            const vuelos = await BusquedaModel.buscarVuelos({
                origen,
                destino,
                pasajeros: cantidadPasajeros,
                fechaSalida: fechaSalida.value,
                fechaRegreso: fechaRegreso.value,
                tipoViaje
            });

            if (!vuelos.length) {
                Swal.fire({ icon: 'error', title: 'Sin vuelos', text: 'No hay vuelos disponibles' });
                return;
            }

            vuelos.forEach((vuelo, index) => {
                const escala = vuelo.layover ? 'Con escala' : 'Directo';
                const duracionMinutos = Math.floor((new Date(vuelo.arrival_time) - new Date(vuelo.departure_time)) / 60000);

                const esIdaVuelta = tipoViaje === 'ida-vuelta' && fechaRegreso && fechaRegreso.value;

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
                if (esIdaVuelta && vuelo.regreso) {
                    const regresoCard = templateRegreso.content.cloneNode(true);
                    regresoCard.querySelector('.salida-regreso').textContent =
                        `${new Date(vuelo.regreso.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(vuelo.regreso.departure_time).toLocaleDateString()}`;
                    regresoCard.querySelector('.origen-regreso').textContent = vuelo.regreso.from;
                    regresoCard.querySelector('.escala-regreso').textContent = vuelo.regreso.layover ? 'Con escala' : 'Directo';
                    regresoCard.querySelector('.duracion-regreso').textContent =
                        `${Math.floor((new Date(vuelo.regreso.arrival_time) - new Date(vuelo.regreso.departure_time)) / 60000)} min`;
                    regresoCard.querySelector('.llegada-regreso').textContent =
                        `${new Date(vuelo.regreso.arrival_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(vuelo.regreso.arrival_time).toLocaleDateString()}`;
                    regresoCard.querySelector('.destino-regreso').textContent = vuelo.regreso.to;

                    card.querySelector('.regreso').appendChild(regresoCard);
                }

                card.querySelector('.reservar-btn').addEventListener('click', () => {
                    Swal.fire({ icon: 'success', title: '¡Reserva confirmada!', text: '✈ Viaje reservado con éxito' });
                });

                dashboard.appendChild(card);
            });
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo cargar la información de vuelos.' });
        }
    }
});