// Define la clase BusquedaModel para manejar la lógica de búsqueda de datos de aeropuertos y vuelos.
export default class BusquedaModel {

  /**
   * Función: obtenerAeropuertos
   * Descripción: Obtiene una lista de aeropuertos.
   * Primero intenta obtener los datos de un archivo PHP. Si falla (por ejemplo, en un entorno sin servidor como GitHub Pages),
   * usa un archivo JSON local como alternativa.
   * @returns {Promise<Array<object>>} Una promesa que resuelve con un arreglo de objetos de aeropuertos.
   */
  static async obtenerAeropuertos() {
    // Define las URL para el archivo PHP y el archivo JSON.
    const phpURL = "../../API/aeropuertos.php";
    const jsonURL = "../../API/data/paises_aeropuertos.json";

    try {
      // Intenta obtener los datos desde la URL del archivo PHP.
      const res = await fetch(phpURL, { cache: "no-store" });
      // Si la respuesta es exitosa, devuelve los datos JSON.
      if (res.ok) return res.json();
    } catch (_) {
      // Si falla la petición, se procede a usar la URL del archivo JSON.
    }
    // Obtiene los datos desde la URL del archivo JSON local.
    const res = await fetch(jsonURL, { cache: "no-store" });
    return res.json();
  }

  /**
   * Función: buscarVuelos
   * Descripción: Busca vuelos basándose en los parámetros de búsqueda.
   * La función primero intenta usar un archivo PHP para la búsqueda. Si la llamada falla,
   * recurre a una simulación de datos en el cliente.
   * @param {object} params - Un objeto con los parámetros de búsqueda (origen, destino, etc.).
   * @returns {Promise<Array<object>>} Una promesa que resuelve con un arreglo de objetos de vuelo.
   */
  static async buscarVuelos(params) {
    // Construye la cadena de consulta a partir de los parámetros.
    const query = new URLSearchParams(params).toString();
    // Define la URL del archivo PHP con los parámetros de la búsqueda.
    const phpURL = `../../API/vuelos.php?${query}`;

    try {
      // Intenta obtener los datos desde la URL del archivo PHP.
      const res = await fetch(phpURL, { cache: "no-store" });
      // Si la respuesta es exitosa, devuelve los datos JSON.
      if (res.ok) return res.json();
    } catch (_) {
      // Si falla la petición, se recurre a la simulación.
    }
    // Llama a la función de simulación de vuelos.
    return this.simularVuelos(params);
  }

  /**
   * Función: simularVuelos
   * Descripción: Simula la generación de una lista de vuelos con datos aleatorios.
   * Esta función es una alternativa cuando no se puede acceder a la API PHP.
   * @param {object} params - Un objeto con los parámetros de búsqueda.
   * @returns {Array<object>} Un arreglo de objetos de vuelo simulados.
   */
  static simularVuelos({ origen, destino, pasajeros = 1, fechaSalida = "", fechaRegreso = "", tipoViaje = "ida" }) {
    // Genera un número aleatorio de vuelos entre 3 y 5.
    const N = Math.floor(Math.random() * 3) + 3;
    // Inicializa un arreglo para almacenar los vuelos.
    const lista = [];
    // Convierte el número de pasajeros a un número entero.
    const paxs = Number(pasajeros) || 1;

    // Crea un objeto de fecha para la salida.
    const baseSalida = fechaSalida ? new Date(fechaSalida) : new Date();
    // Ajusta la hora de la fecha de salida a las 12:00 si es necesario.
    if (baseSalida.getHours() === 0 && baseSalida.getMinutes() === 0) {
      baseSalida.setHours(12, 0, 0, 0);
    }

    // Bucle para generar cada vuelo individualmente.
    for (let i = 0; i < N; i++) {
      // Crea una copia de la fecha de salida y establece una hora aleatoria.
      const salida = new Date(baseSalida);
      salida.setHours(5 + Math.floor(Math.random() * 18), Math.floor(Math.random() * 60), 0, 0);

      // Determina si el vuelo tiene escala de forma aleatoria.
      let layover = Math.random() < 0.5 ? false : true;
      // Calcula una duración aleatoria en minutos, dependiendo de si hay escala.
      const durMin = layover ? (240 + Math.floor(Math.random() * 361)) : (60 + Math.floor(Math.random() * 181));
      // Calcula la fecha de llegada sumando la duración a la fecha de salida.
      const llegada = new Date(salida.getTime() + durMin * 60000);

      // Genera un precio aleatorio por pasajero y calcula el precio total.
      const price = 200 + Math.floor(Math.random() * 1001);
      const precioTotal = price * paxs;

      // Crea un objeto con los datos del vuelo de ida.
      const vuelo = {
        from: origen,
        to: destino,
        departure_time: salida.toISOString(),
        arrival_time: llegada.toISOString(),
        layover,
        price,
        precio: price,
        precioTotal,
        pasajeros: paxs
      };

      // Si el viaje es de ida y vuelta, genera los datos para el vuelo de regreso.
      if (tipoViaje === "ida-vuelta" && fechaRegreso) {
        // Crea un objeto de fecha para el regreso y lo ajusta.
        const baseReg = new Date(fechaRegreso);
        if (baseReg.getHours() === 0 && baseReg.getMinutes() === 0) {
          baseReg.setHours(12, 0, 0, 0);
        }
        // Crea una copia de la fecha de regreso y establece una hora aleatoria.
        const sal2 = new Date(baseReg);
        sal2.setHours(5 + Math.floor(Math.random() * 18), Math.floor(Math.random() * 60), 0, 0);
        // Determina la escala y la duración del vuelo de regreso.
        const lay2 = Math.random() < 0.5 ? false : true;
        const dur2 = lay2 ? (240 + Math.floor(Math.random() * 361)) : (60 + Math.floor(Math.random() * 181));
        const leg2 = new Date(sal2.getTime() + dur2 * 60000);

        // Añade el objeto de regreso al objeto de vuelo principal.
        vuelo.regreso = {
          from: destino,
          to: origen,
          departure_time: sal2.toISOString(),
          arrival_time: leg2.toISOString(),
          layover: lay2
        };
      }

      // Añade el vuelo generado a la lista.
      lista.push(vuelo);
    }

    // Ordena la lista de vuelos por precio total de forma ascendente.
    lista.sort((a, b) => (a.precioTotal ?? a.precio ?? a.price) - (b.precioTotal ?? b.precio ?? b.price));
    // Devuelve la lista ordenada de vuelos simulados.
    return lista;
  }
};