// Importa el modelo que maneja la lógica de datos de las reservas.
import ReservaModel from '../MODELO/reserva.model.js';

// Define un objeto de controlador para la gestión de reservas de vuelos.
export const ReservaController = {

  /**
   * Función: reservarVuelo
   * Descripción: Procesa la reserva de un vuelo.
   * La función verifica si el usuario está activo, crea un objeto de reserva
   * y lo guarda en el almacenamiento utilizando el modelo.
   * @param {object} vuelo - Un objeto con los detalles del vuelo.
   * @param {number} pasajeros - El número de pasajeros.
   * @returns {object} Retorna un objeto con un estado de éxito y un mensaje.
   */
  reservarVuelo(vuelo, pasajeros) {
    // Obtiene la información del usuario del almacenamiento local.
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario) {
      return { success: false, message: 'Debes iniciar sesión para reservar' };
    }

    // Obtiene el precio total del vuelo.
    const precioTotal = Number(vuelo.precioTotal ?? vuelo.precio ?? 0);

    // Normaliza las fechas del vuelo a formato ISO 8601.
    const fechaSalida = vuelo.departure_time ? new Date(vuelo.departure_time).toISOString() : null;
    const fechaLlegada = vuelo.arrival_time ? new Date(vuelo.arrival_time).toISOString() : null;

    // Crea un objeto con los datos de la reserva.
    const reserva = {
      usuario: usuario.email,
      // Guarda los códigos y países para futuras visualizaciones y filtros.
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

    // Llama al modelo para guardar la reserva.
    ReservaModel.guardarReserva(reserva);
    // Retorna una respuesta de éxito.
    return { success: true, message: 'Reserva confirmada' };
  },

  /**
   * Función: obtenerReservasUsuario
   * Descripción: Recupera y devuelve todas las reservas asociadas al usuario actual.
   * Las reservas se ordenan por la fecha de creación de forma descendente.
   * @returns {Array<object>} Retorna un arreglo de objetos de reserva.
   */
  obtenerReservasUsuario() {
    // Obtiene el usuario activo.
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    // Si no hay usuario, devuelve un arreglo vacío.
    if (!usuario) return [];
    // Filtra y ordena las reservas del usuario.
    return ReservaModel
      .obtenerReservas()
      .filter(r => r.usuario === usuario.email)
      .sort((a, b) => new Date(b.fechaReserva) - new Date(a.fechaReserva));
  },

  /**
   * Función: limpiarReservasUsuario
   * Descripción: Elimina todas las reservas del usuario actualmente activo.
   */
  limpiarReservasUsuario() {
    // Obtiene el usuario activo.
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    // Si no hay usuario, no hace nada.
    if (!usuario) return;
    // Llama al modelo para eliminar las reservas del usuario.
    ReservaModel.eliminarReservasPorUsuario(usuario.email);
  }
};