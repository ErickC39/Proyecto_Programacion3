/* -------- Importaciones -------- */
// Importa el controlador para la lógica de autenticación del usuario.
import { loginController } from "./loginController.js";
// Importa el controlador para la lógica de reserva de vuelos.
import { ReservaController } from "./reserva.controller.js";
// Importa el modelo para manejar la lógica de datos de búsqueda.
import BusquedaModel from "../MODELO/busqueda.model.js";

/* -------- Utilidades fecha/hora -------- */

/**
 * Función: generarHoraAleatoria
 * Descripción: Genera un objeto con una hora y un minuto aleatorios.
 * @returns {object} Un objeto con las propiedades `hora` y `minuto`.
 */
function generarHoraAleatoria() {
  // Genera una hora aleatoria entre las 5 y las 21.
  const hora = Math.floor(Math.random() * (22 - 5)) + 5;
  // Genera un minuto aleatorio entre 0 y 59.
  const minuto = Math.floor(Math.random() * 60);
  return { hora, minuto };
}

/**
 * Función: calcularLlegada
 * Descripción: Calcula la hora de llegada y la duración del vuelo a partir de una hora de salida.
 * @param {Date} salida - La fecha y hora de salida del vuelo.
 * @param {boolean} conEscala - Un booleano que indica si el vuelo tiene escala.
 * @returns {object} Un objeto con la fecha y hora de llegada y la duración del vuelo.
 */
function calcularLlegada(salida, conEscala = false) {
  // Define la duración del vuelo en horas, que es más larga si hay una escala.
  const duracionHoras = conEscala
    ? Math.floor(Math.random() * 6) + 4
    : Math.floor(Math.random() * 3) + 1;
  // Define una duración aleatoria en minutos.
  const duracionMin = Math.floor(Math.random() * 60);

  // Crea una copia de la fecha de salida y añade la duración para obtener la llegada.
  const llegada = new Date(salida.getTime());
  llegada.setHours(llegada.getHours() + duracionHoras);
  llegada.setMinutes(llegada.getMinutes() + duracionMin);

  // Devuelve la fecha de llegada y un string formateado con la duración.
  return { llegada, duracion: `${duracionHoras}h ${duracionMin}m` };
}

/**
 * Función: fmtFechaHora
 * Descripción: Formatea una fecha en un string legible.
 * @param {string} str - El string de la fecha a formatear.
 * @returns {string} La fecha y hora formateadas.
 */
function fmtFechaHora(str) {
  // Crea un objeto de fecha a partir del string.
  const dt = new Date(str);
  // Formatea la fecha en formato día, mes y año.
  const f = dt.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
  // Formatea la hora en formato de 24 horas.
  const h = dt.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
  // Combina la hora y la fecha formateadas.
  return `${h} - ${f}`;
}

/* -------- Renderizado vuelos ida -------- */

/**
 * Función: renderVuelosIda
 * Descripción: Renderiza y muestra una lista de vuelos de ida en el contenedor.
 * @param {Array<object>} vuelos - Una lista de objetos de vuelo.
 * @param {HTMLTemplateElement} template - La plantilla HTML para un vuelo.
 * @param {HTMLElement} container - El contenedor donde se mostrarán los vuelos.
 */
function renderVuelosIda(vuelos, template, container) {
  // Limpia el contenido del contenedor antes de renderizar nuevos vuelos.
  container.innerHTML = "";

  // Muestra un mensaje si no se encontraron vuelos.
  if (!vuelos.length) {
    container.innerHTML = `<p class="text-muted text-center">No se encontraron vuelos</p>`;
    return;
  }

  // Encuentra el precio más bajo entre los vuelos.
  let minPrecio = Math.min(...vuelos.map(v => v.precio ?? v.price));

  // Itera sobre cada vuelo para renderizarlo.
  vuelos.forEach((vuelo, idx) => {
    // Clona la plantilla HTML para cada vuelo.
    const clone = template.content.cloneNode(true);

    // Genera y establece una hora de salida aleatoria.
    const { hora, minuto } = generarHoraAleatoria();
    const salida = new Date(vuelo.departure_time);
    salida.setHours(hora, minuto, 0, 0);

    // Calcula la hora de llegada y la duración del vuelo.
    const { llegada, duracion } = calcularLlegada(salida, vuelo.layover);

    // Rellena los campos de la plantilla con los datos del vuelo.
    clone.querySelector(".origen").textContent = vuelo.from;
    clone.querySelector(".destino").textContent = vuelo.to;
    clone.querySelector(".salida").textContent = fmtFechaHora(salida);
    clone.querySelector(".llegada").textContent = fmtFechaHora(llegada);
    clone.querySelector(".escala").textContent = vuelo.layover ? "Con escala" : "Directo";
    clone.querySelector(".duracion").textContent = duracion;

    // Calcula y muestra el precio unitario y total.
    const precioUnit = vuelo.precio ?? vuelo.price;
    const pasajeros = vuelo.pasajeros || 1;
    const precioTotal = vuelo.precioTotal ?? precioUnit * pasajeros;

    const precioEl = clone.querySelector(".precio");
    if (pasajeros > 1) {
      precioEl.textContent = `USD ${precioTotal} (${precioUnit} x ${pasajeros} pasajeros)`;
    } else {
      precioEl.textContent = `USD ${precioTotal}`;
    }

    // Agrega una etiqueta si el vuelo es el más barato.
    if (precioUnit === minPrecio) {
      const badge = document.createElement("span");
      badge.textContent = "Mejor precio";
      badge.classList.add("badge", "bg-success", "ms-2");
      precioEl.appendChild(badge);
    }

    // Configura el evento de clic para el botón de reservar.
    const btnReservar = clone.querySelector(".reservar-btn");
    btnReservar.addEventListener("click", () => {
      // Verifica si el usuario está logueado antes de permitir la reserva.
      const usuario = loginController.usuarioActivo();
      if (!usuario) {
        Swal.fire({
          icon: "warning",
          title: "Inicia sesión",
          text: "Debes iniciar sesión para reservar."
        }).then(() => (window.location.href = "login.html"));
        return;
      }

      // Llama a la función de reserva y muestra el resultado con una alerta.
      const r = ReservaController.reservarVuelo(
        {
          ...vuelo,
          departure_time: salida.toISOString(),
          arrival_time: llegada.toISOString()
        },
        pasajeros
      );

      Swal.fire({
        icon: r.success ? "success" : "error",
        title: r.message
      });
    });

    // Añade el elemento del vuelo al contenedor.
    container.appendChild(clone);
  });
}

/* -------- Renderizado vuelos regreso -------- */

/**
 * Función: renderVuelosRegreso
 * Descripción: Renderiza y muestra una lista de vuelos de regreso en el contenedor.
 * @param {Array<object>} vuelos - Una lista de objetos de vuelo.
 * @param {HTMLTemplateElement} template - La plantilla HTML para un vuelo de regreso.
 * @param {HTMLElement} container - El contenedor donde se mostrarán los vuelos.
 */
function renderVuelosRegreso(vuelos, template, container) {
  // Sale de la función si no hay vuelos para renderizar.
  if (!vuelos.length) return;

  // Encuentra el precio más bajo entre los vuelos.
  let minPrecio = Math.min(...vuelos.map(v => v.precio ?? v.price));

  // Itera sobre cada vuelo para renderizarlo.
  vuelos.forEach(vuelo => {
    // Clona la plantilla HTML para cada vuelo de regreso.
    const clone = template.content.cloneNode(true);

    // Genera y establece una hora de salida aleatoria.
    const { hora, minuto } = generarHoraAleatoria();
    const salida = new Date(vuelo.departure_time);
    salida.setHours(hora, minuto, 0, 0);

    // Calcula la hora de llegada y la duración del vuelo.
    const { llegada, duracion } = calcularLlegada(salida, vuelo.layover);

    // Rellena los campos de la plantilla con los datos del vuelo de regreso.
    clone.querySelector(".origen-regreso").textContent = vuelo.from;
    clone.querySelector(".destino-regreso").textContent = vuelo.to;
    clone.querySelector(".salida-regreso").textContent = fmtFechaHora(salida);
    clone.querySelector(".llegada-regreso").textContent = fmtFechaHora(llegada);
    clone.querySelector(".escala-regreso").textContent = vuelo.layover ? "Con escala" : "Directo";
    clone.querySelector(".duracion-regreso").textContent = duracion;

    // Añade el elemento del vuelo de regreso al contenedor.
    container.appendChild(clone);
  });
}

/* -------- Inicialización -------- */
// Espera a que el documento se cargue completamente antes de ejecutar el código.
document.addEventListener("DOMContentLoaded", async () => {
  // Obtiene referencias a los elementos del DOM.
  const btnBuscar = document.getElementById("buscar-vuelo");
  const selectOrigen = document.getElementById("origen");
  const selectDestino = document.getElementById("destino");
  const fechaSalida = document.getElementById("fecha-salida");
  const fechaRegreso = document.getElementById("fecha-regreso");
  const btnIda = document.getElementById("btn-ida");
  const btnIdaVuelta = document.getElementById("btn-ida-vuelta");

  const containerVuelos = document.getElementById("vuelos-dashboard");
  const templateVuelo = document.getElementById("template-vuelo");
  const templateVueloRegreso = document.getElementById("template-vuelo-regreso");

  /* --- Cargar aeropuertos --- */
  try {
    let aeropuertos;
    // Carga los datos de aeropuertos desde un archivo local si la URL contiene "github.io".
    if (window.location.hostname.includes("github.io")) {
      const res = await fetch("../API/data/paises_aeropuertos.json");
      aeropuertos = await res.json();
    } else {
      // Carga los aeropuertos usando el modelo de búsqueda.
      aeropuertos = await BusquedaModel.obtenerAeropuertos();
    }

    // Ordena los aeropuertos por país y los añade a los menús desplegables.
    aeropuertos
      .sort((a, b) => a.country.localeCompare(b.country))
      .forEach(a => {
        const opt1 = document.createElement("option");
        opt1.value = a.code;
        opt1.textContent = `${a.country} (${a.code})`;
        selectOrigen.appendChild(opt1);

        const opt2 = document.createElement("option");
        opt2.value = a.code;
        opt2.textContent = `${a.country} (${a.code})`;
        selectDestino.appendChild(opt2);
      });
  } catch (err) {
    console.error("Error cargando aeropuertos:", err);
  }

  /* --- Prefill desde destinos.html --- */
  // Lee los parámetros de la URL para prellenar los campos de búsqueda.
  const params = new URLSearchParams(window.location.search);
  const destinoParam = params.get("destino");

  // Si se encontró un parámetro de destino, prellena los campos.
  if (destinoParam) {
    const usuario = loginController.usuarioActivo();

    // Muestra una alerta si el usuario no ha iniciado sesión.
    if (!usuario) {
      Swal.fire({
        icon: "warning",
        title: "Inicia sesión",
        text: "Debes iniciar sesión para reservar o buscar vuelos desde destinos."
      }).then(() => (window.location.href = "login.html"));
    } else {
      // Selecciona el origen por defecto como SJO.
      for (let i = 0; i < selectOrigen.options.length; i++) {
        if (selectOrigen.options[i].value === "SJO") {
          selectOrigen.selectedIndex = i;
          break;
        }
      }

      // Selecciona el destino según el parámetro de la URL.
      for (let i = 0; i < selectDestino.options.length; i++) {
        if (selectDestino.options[i].value === destinoParam) {
          selectDestino.selectedIndex = i;
          break;
        }
      }
    }
  }

  /* --- Activar tipo de viaje --- */
  // Añade un evento para manejar la selección de viaje de ida.
  btnIda.addEventListener("click", () => {
    btnIda.classList.add("active");
    btnIdaVuelta.classList.remove("active");
    fechaRegreso.disabled = true;
  });

  // Añade un evento para manejar la selección de viaje de ida y vuelta.
  btnIdaVuelta.addEventListener("click", () => {
    btnIdaVuelta.classList.add("active");
    btnIda.classList.remove("active");
    fechaRegreso.disabled = false;
  });

  /* --- Control de pasajeros --- */
  // Obtiene referencias a los elementos del control de pasajeros.
  const inputPasajeros = document.getElementById("pasajeros");
  const btnMas = document.getElementById("incrementar");
  const btnMenos = document.getElementById("decrementar");

  // Establece el valor por defecto de los pasajeros en 1 si no está definido.
  if (!inputPasajeros.value) inputPasajeros.value = 1;

  // Aumenta el número de pasajeros al hacer clic.
  btnMas.addEventListener("click", () => {
    let valor = parseInt(inputPasajeros.value) || 1;
    valor++;
    inputPasajeros.value = valor;
  });

  // Disminuye el número de pasajeros al hacer clic, asegurándose de que no sea menor a 1.
  btnMenos.addEventListener("click", () => {
    let valor = parseInt(inputPasajeros.value) || 1;
    if (valor > 1) valor--;
    inputPasajeros.value = valor;
  });

  /* --- Buscar vuelos --- */
  // Añade un evento para buscar vuelos al hacer clic en el botón.
  btnBuscar.addEventListener("click", async () => {
    // Obtiene los valores de los campos de búsqueda.
    const origen = selectOrigen.value;
    const destino = selectDestino.value;
    const pasajeros = document.getElementById("pasajeros").value;
    const salida = fechaSalida.value;
    const regreso = fechaRegreso.value;
    const tipoViaje = btnIdaVuelta.classList.contains("active") ? "ida-vuelta" : "ida";

    // Muestra una alerta si faltan campos requeridos.
    if (!origen || !destino || !salida) {
      Swal.fire({ icon: "warning", title: "Completa los campos requeridos" });
      return;
    }

    // Busca vuelos de ida usando el modelo.
    let vuelosIda = await BusquedaModel.buscarVuelos({
      origen,
      destino,
      pasajeros,
      fechaSalida: salida
    });

    // Si el viaje es solo de ida, renderiza los vuelos de ida.
    if (tipoViaje === "ida") {
      renderVuelosIda(vuelosIda, templateVuelo, containerVuelos);
      return;
    }

    // Si el viaje es de ida y vuelta, busca vuelos de regreso.
    let vuelosRegreso = [];
    if (regreso) {
      vuelosRegreso = await BusquedaModel.buscarVuelos({
        origen: destino,
        destino: origen,
        pasajeros,
        fechaSalida: regreso
      });
    }

    // Limpia el contenedor de vuelos.
    containerVuelos.innerHTML = "";

    // Combina y renderiza los vuelos de ida y regreso.
    for (let i = 0; i < vuelosIda.length; i++) {
      const vueloIda = vuelosIda[i];
      const vueloRegreso = vuelosRegreso[i] || null;

      // Crea un contenedor para cada par de vuelos.
      const wrapper = document.createElement("div");
      wrapper.classList.add("mb-4", "p-3", "border", "rounded", "shadow-sm");

      // Renderiza el vuelo de ida dentro del contenedor.
      renderVuelosIda([vueloIda], templateVuelo, wrapper);

      // Renderiza el vuelo de regreso si existe.
      if (vueloRegreso) {
        renderVuelosRegreso([vueloRegreso], templateVueloRegreso, wrapper);
      }

      // Añade el contenedor al DOM principal.
      containerVuelos.appendChild(wrapper);
    }
  });
});