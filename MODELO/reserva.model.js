/* -------- Modelo de reservas (localStorage) -------- */
const KEY = 'reservas';

export default {
  obtenerReservas() {
  try {
    const arr = JSON.parse(localStorage.getItem(KEY)) || [];
    // limpiar las reservas que tengan fechas inválidas
    return arr.filter(r => {
      const campos = [r.fechaSalida, r.fechaLlegada, r.fechaReserva];
      return campos.every(c => !c || !isNaN(new Date(c).getTime()) || !isNaN(Number(c)));
    });
  } catch {
    return [];
  }
},


  guardarReserva(reserva) {
    const reservas = this.obtenerReservas();
    reservas.push(reserva);
    localStorage.setItem(KEY, JSON.stringify(reservas));
  },

  eliminarReservasPorUsuario(email) {
    const reservas = this.obtenerReservas().filter(r => r.usuario !== email);
    localStorage.setItem(KEY, JSON.stringify(reservas));
  },

  limpiarTodo() {
    localStorage.removeItem(KEY);
  }
};
