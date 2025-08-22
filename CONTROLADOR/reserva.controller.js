/* -------- Importaciones -------- */
import ReservaModel from '../MODELO/reserva.model.js';

/* -------- Controlador de reservas -------- */
export const ReservaController = {
  reservarVuelo(vuelo, pasajeros) {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario) {
      return { success: false, message: 'Debes iniciar sesión para reservar' };
    }

    const precioTotal = Number(vuelo.precioTotal ?? vuelo.precio ?? 0);

    // Normalizar fechas a ISO o null
    const fechaSalida = vuelo.departure_time ? new Date(vuelo.departure_time).toISOString() : null;
    const fechaLlegada = vuelo.arrival_time ? new Date(vuelo.arrival_time).toISOString() : null;

    const reserva = {
      usuario: usuario.email,
      // guardamos códigos y países para mostrar y poder filtrar
      origenCodigo: vuelo.from,
      destinoCodigo: vuelo.to,
      origenPais: vuelo.origenPais || null,
      destinoPais: vuelo.destinoPais || null,
      fechaSalida,
      fechaLlegada,
      pasajeros: Number(pasajeros) || 1,
      precio: precioTotal,
      fechaReserva: new Date().toISOString()
    };

    ReservaModel.guardarReserva(reserva);
    return { success: true, message: 'Reserva confirmada' };
  },

  obtenerReservasUsuario() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario) return [];
    return ReservaModel
      .obtenerReservas()
      .filter(r => r.usuario === usuario.email)
      .sort((a, b) => new Date(b.fechaReserva) - new Date(a.fechaReserva));
  },

  limpiarReservasUsuario() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario) return;
    ReservaModel.eliminarReservasPorUsuario(usuario.email);
  }
};
