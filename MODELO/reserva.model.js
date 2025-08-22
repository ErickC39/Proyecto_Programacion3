// Define la clave que se usará para almacenar las reservas en el localStorage.
const KEY = 'reservas';

// Exporta un objeto que maneja la lógica de datos de las reservas.
export default {
  /**
   * Función: obtenerReservas
   * Descripción: Recupera todas las reservas del localStorage.
   * La función maneja errores y filtra las reservas para eliminar las que tengan fechas no válidas.
   * @returns {Array<object>} Un arreglo de objetos de reserva.
   */
  obtenerReservas() {
    try {
      // Intenta obtener las reservas del localStorage o un arreglo vacío si no existen.
      const arr = JSON.parse(localStorage.getItem(KEY)) || [];
      // Filtra el arreglo para devolver solo las reservas con fechas válidas.
      return arr.filter(r => {
        const campos = [r.fechaSalida, r.fechaLlegada, r.fechaReserva];
        return campos.every(c => !c || !isNaN(new Date(c).getTime()) || !isNaN(Number(c)));
      });
    } catch {
      // En caso de error, retorna un arreglo vacío para evitar fallos.
      return [];
    }
  },

  /**
   * Función: guardarReserva
   * Descripción: Agrega una nueva reserva a la lista existente en el localStorage.
   * @param {object} reserva - El objeto de reserva a guardar.
   */
  guardarReserva(reserva) {
    // Obtiene el arreglo de reservas actual.
    const reservas = this.obtenerReservas();
    // Añade la nueva reserva al arreglo.
    reservas.push(reserva);
    // Guarda el arreglo actualizado en el localStorage.
    localStorage.setItem(KEY, JSON.stringify(reservas));
  },

  /**
   * Función: eliminarReservasPorUsuario
   * Descripción: Elimina todas las reservas asociadas a un correo electrónico de usuario específico.
   * @param {string} email - El correo electrónico del usuario cuyas reservas se deben eliminar.
   */
  eliminarReservasPorUsuario(email) {
    // Filtra las reservas, manteniendo solo las que no coincidan con el email proporcionado.
    const reservas = this.obtenerReservas().filter(r => r.usuario !== email);
    // Guarda la lista filtrada de nuevo en el localStorage.
    localStorage.setItem(KEY, JSON.stringify(reservas));
  },

  /**
   * Función: limpiarTodo
   * Descripción: Elimina todas las reservas del localStorage.
   */
  limpiarTodo() {
    // Remueve la clave de reservas del localStorage.
    localStorage.removeItem(KEY);
  }
};