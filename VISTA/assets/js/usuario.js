/* -------- Importaciones -------- */
import { loginController } from "../../../CONTROLADOR/loginController.js";
import { ReservaController } from "../../../CONTROLADOR/reserva.controller.js";
import BusquedaModel from "../../../MODELO/busqueda.model.js";

/* -------- Utilidades fecha/hora -------- */
function esISOConZona(str){ return /Z|[+-]\d{2}:\d{2}$/.test(str); }
function fmtFechaHora(str){
  const dt = new Date(str);
  const baseF = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const baseH = { hour: '2-digit', minute: '2-digit' };
  const tz = esISOConZona(str) ? { timeZone: 'UTC' } : {};
  const f = new Intl.DateTimeFormat(undefined, { ...baseF, ...tz }).format(dt);
  const h = new Intl.DateTimeFormat(undefined, { ...baseH, ...tz }).format(dt);
  return `${h} - ${f}`;
}

// mostrar siempre en hora local del dispositivo
function fmtFechaLocal(str) {
  const dt = new Date(str);
  return dt.toLocaleString("es-CR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

/* -------- Estado global simple -------- */
let mapaAeropuertos = {}; // IATA -> País

document.addEventListener("DOMContentLoaded", async () => {
  const btnCerrar = document.getElementById("btnCerrarSesion");
  const reservasContainer = document.getElementById("reservasContainer");
  const btnLimpiar = document.getElementById("btnLimpiarReservas"); // añade este botón en usuario.html

  const usuario = loginController.usuarioActivo();
  if (!usuario) {
    Swal.fire({ icon: 'info', title: 'Sesión requerida', text: 'Inicia sesión para ver tus reservas.' })
      .then(() => window.location.href = "login.html");
    return;
  }

  // Construir mapa IATA->País para mostrar bonito aunque la reserva tenga sólo códigos
  try {
    const aeropuertos = await BusquedaModel.obtenerAeropuertos();
    aeropuertos.forEach(a => { mapaAeropuertos[a.code] = a.country; });
  } catch { /* si falla, mostramos los códigos como fallback */ }

  renderReservas();

  // Cerrar sesión
  if (btnCerrar) {
  btnCerrar.addEventListener("click", () => {
    Swal.fire({
      icon: "question",
      title: "¿Cerrar sesión?",
      text: "Tu sesión actual se cerrará.",
      showCancelButton: true,
      confirmButtonText: "Sí, cerrar",
      cancelButtonText: "Cancelar"
    }).then((res) => {
      if (res.isConfirmed) {
        loginController.cerrarSesion();

        Swal.fire({
          icon: "success",
          title: "Sesión cerrada",
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          window.location.href = "../../index.html";
        });
      }
    });
  });
}

  // Limpiar historial de reservas (solo del usuario actual)
  if (btnLimpiar) {
    btnLimpiar.addEventListener("click", () => {
      Swal.fire({
        icon: 'warning',
        title: '¿Limpiar historial?',
        text: 'Se eliminarán todas tus reservas guardadas en este navegador.',
        showCancelButton: true,
        confirmButtonText: 'Sí, limpiar',
        cancelButtonText: 'Cancelar'
      }).then(r => {
        if (r.isConfirmed) {
          ReservaController.limpiarReservasUsuario();
          Swal.fire({ icon: 'success', title: 'Historial eliminado', timer: 1200, showConfirmButton: false })
            .then(() => renderReservas());
        }
      });
    });
  }

  /* -------- Render de reservas -------- */
  function renderReservas() {
    reservasContainer.innerHTML = '';
    const reservas = ReservaController.obtenerReservasUsuario();

    if (!reservas.length) {
      reservasContainer.innerHTML = `<p class="text-muted text-center">No tienes reservas todavía.</p>`;
      Swal.fire({ icon: 'info', title: 'Sin reservas', text: 'Cuando reserves, aparecerán aquí.' });
      return;
    }

    Swal.fire({ icon: 'info', title: 'Reservas encontradas', text: `Tienes ${reservas.length} reserva(s).` });

    reservas.forEach(r => {
      const origenPais  = r.origenPais || mapaAeropuertos[r.origenCodigo] || r.origenCodigo;
      const destinoPais = r.destinoPais || mapaAeropuertos[r.destinoCodigo] || r.destinoCodigo;

      const card = document.createElement('div');
      card.className = 'card p-3 mb-2';
      card.innerHTML = `
        <h5>${origenPais} → ${destinoPais}</h5>
        <p><strong>Salida:</strong> ${fmtFechaHora(r.fechaSalida)}</p>
        <p><strong>Llegada:</strong> ${fmtFechaHora(r.fechaLlegada)}</p>
        <p><strong>Pasajeros:</strong> ${r.pasajeros}</p>
        <p><strong>Precio:</strong> USD ${Number(r.precio || 0).toFixed(2)}</p>
        <p class="text-muted"><em>Reservado el ${fmtFechaLocal(r.fechaReserva)}</em></p>
      `;
      reservasContainer.appendChild(card);
    });
  }
});
