/* -------- Importaciones -------- */
import { loginController } from "./loginController.js";
import { ReservaController } from "./reserva.controller.js";
import BusquedaModel from "../MODELO/busqueda.model.js";

/* -------- Utilidades fecha/hora -------- */
function generarHoraAleatoria() {
  const hora = Math.floor(Math.random() * (22 - 5)) + 5; // entre 5 y 21
  const minuto = Math.floor(Math.random() * 60);
  return { hora, minuto };
}

function calcularLlegada(salida, conEscala = false) {
  const duracionHoras = conEscala
    ? Math.floor(Math.random() * 6) + 4
    : Math.floor(Math.random() * 3) + 1;
  const duracionMin = Math.floor(Math.random() * 60);

  const llegada = new Date(salida.getTime());
  llegada.setHours(llegada.getHours() + duracionHoras);
  llegada.setMinutes(llegada.getMinutes() + duracionMin);

  return { llegada, duracion: `${duracionHoras}h ${duracionMin}m` };
}

function fmtFechaHora(str) {
  const dt = new Date(str);
  const f = dt.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
  const h = dt.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
  return `${h} - ${f}`;
}

/* -------- Renderizado vuelos ida -------- */
function renderVuelosIda(vuelos, template, container) {
  container.innerHTML = "";

  if (!vuelos.length) {
    container.innerHTML = `<p class="text-muted text-center">No se encontraron vuelos</p>`;
    return;
  }

  vuelos.forEach((vuelo, idx) => {
    const clone = template.content.cloneNode(true);

    // Generar salida aleatoria
    const { hora, minuto } = generarHoraAleatoria();
    const salida = new Date(vuelo.departure_time);
    salida.setHours(hora, minuto, 0, 0);

    // Calcular llegada
    const { llegada, duracion } = calcularLlegada(salida, vuelo.layover);

    // Rellenar
    clone.querySelector(".origen").textContent = vuelo.from;
    clone.querySelector(".destino").textContent = vuelo.to;
    clone.querySelector(".salida").textContent = fmtFechaHora(salida);
    clone.querySelector(".llegada").textContent = fmtFechaHora(llegada);
    clone.querySelector(".escala").textContent = vuelo.layover ? "Con escala" : "Directo";
    clone.querySelector(".duracion").textContent = duracion;

    // Precio unitario y total
    const precioUnit = vuelo.precio ?? vuelo.price;
    const pasajeros = vuelo.pasajeros || 1;
    const precioTotal = vuelo.precioTotal ?? precioUnit * pasajeros;

    const precioEl = clone.querySelector(".precio");
    if (pasajeros > 1) {
      precioEl.textContent = `USD ${precioTotal} (${precioUnit} x ${pasajeros} pasajeros)`;
    } else {
      precioEl.textContent = `USD ${precioTotal}`;
    }

    // Etiqueta "Mejor precio" en el más barato
    if (idx === 0) {
      const badge = document.createElement("span");
      badge.textContent = "Mejor precio";
      badge.classList.add("badge", "bg-success", "ms-2");
      precioEl.appendChild(badge);
    }

    // Botón reservar
    const btnReservar = clone.querySelector(".reservar-btn");
    btnReservar.addEventListener("click", () => {
      const usuario = loginController.usuarioActivo();
      if (!usuario) {
        Swal.fire({
          icon: "warning",
          title: "Inicia sesión",
          text: "Debes iniciar sesión para reservar."
        }).then(() => (window.location.href = "login.html"));
        return;
      }

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

    container.appendChild(clone);
  });
}

/* -------- Renderizado vuelos regreso -------- */
function renderVuelosRegreso(vuelos, template, container) {
  if (!vuelos.length) return;

  vuelos.forEach(vuelo => {
    const clone = template.content.cloneNode(true);

    // Generar salida aleatoria
    const { hora, minuto } = generarHoraAleatoria();
    const salida = new Date(vuelo.departure_time);
    salida.setHours(hora, minuto, 0, 0);

    // Calcular llegada
    const { llegada, duracion } = calcularLlegada(salida, vuelo.layover);

    // Rellenar
    clone.querySelector(".origen-regreso").textContent = vuelo.from;
    clone.querySelector(".destino-regreso").textContent = vuelo.to;
    clone.querySelector(".salida-regreso").textContent = fmtFechaHora(salida);
    clone.querySelector(".llegada-regreso").textContent = fmtFechaHora(llegada);
    clone.querySelector(".escala-regreso").textContent = vuelo.layover ? "Con escala" : "Directo";
    clone.querySelector(".duracion-regreso").textContent = duracion;

    container.appendChild(clone);
  });
}

/* -------- Inicialización -------- */
document.addEventListener("DOMContentLoaded", async () => {
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
    if (window.location.hostname.includes("github.io")) {
      const res = await fetch("../API/data/paises_aeropuertos.json");
      aeropuertos = await res.json();
    } else {
      aeropuertos = await BusquedaModel.obtenerAeropuertos();
    }

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

  /* --- Activar tipo de viaje --- */
  btnIda.addEventListener("click", () => {
    btnIda.classList.add("active");
    btnIdaVuelta.classList.remove("active");
    fechaRegreso.disabled = true;
  });

  btnIdaVuelta.addEventListener("click", () => {
    btnIdaVuelta.classList.add("active");
    btnIda.classList.remove("active");
    fechaRegreso.disabled = false;
  });

  /* --- Control de pasajeros --- */
  const inputPasajeros = document.getElementById("pasajeros");
  const btnMas = document.getElementById("incrementar");
  const btnMenos = document.getElementById("decrementar");

  if (!inputPasajeros.value) inputPasajeros.value = 1;

  btnMas.addEventListener("click", () => {
    let valor = parseInt(inputPasajeros.value) || 1;
    valor++;
    inputPasajeros.value = valor;
  });

  btnMenos.addEventListener("click", () => {
    let valor = parseInt(inputPasajeros.value) || 1;
    if (valor > 1) valor--;
    inputPasajeros.value = valor;
  });

  /* --- Buscar vuelos --- */
  btnBuscar.addEventListener("click", async () => {
    const origen = selectOrigen.value;
    const destino = selectDestino.value;
    const pasajeros = document.getElementById("pasajeros").value;
    const salida = fechaSalida.value;
    const regreso = fechaRegreso.value;
    const tipoViaje = btnIdaVuelta.classList.contains("active") ? "ida-vuelta" : "ida";

    if (!origen || !destino || !salida) {
      Swal.fire({ icon: "warning", title: "Completa los campos requeridos" });
      return;
    }

    // Buscar vuelos de ida
    let vuelosIda = await BusquedaModel.buscarVuelos({
      origen,
      destino,
      pasajeros,
      fechaSalida: salida
    });

    // Solo ida → render normal
    if (tipoViaje === "ida") {
      renderVuelosIda(vuelosIda, templateVuelo, containerVuelos);
      return;
    }

    // Ida y vuelta → buscar regreso
    let vuelosRegreso = [];
    if (regreso) {
      vuelosRegreso = await BusquedaModel.buscarVuelos({
        origen: destino,
        destino: origen,
        pasajeros,
        fechaSalida: regreso
      });
    }

    // Limpiar contenedor
    containerVuelos.innerHTML = "";

    // Combinar ida + regreso
    for (let i = 0; i < vuelosIda.length; i++) {
      const vueloIda = vuelosIda[i];
      const vueloRegreso = vuelosRegreso[i] || null;

      // Bloque principal
      const wrapper = document.createElement("div");
      wrapper.classList.add("mb-4", "p-3", "border", "rounded", "shadow-sm");

      // Insertar vuelo de ida
      renderVuelosIda([vueloIda], templateVuelo, wrapper);

      // Insertar vuelo de regreso (si existe)
      if (vueloRegreso) {
        renderVuelosRegreso([vueloRegreso], templateVueloRegreso, wrapper);
      }

      containerVuelos.appendChild(wrapper);
    }
  });
});
