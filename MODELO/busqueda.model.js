export default class BusquedaModel {
  // Aeropuertos: intenta PHP; si falla, usa JSON dentro de API/data
  static async obtenerAeropuertos() {
    // Rutas relativas desde VISTA/pages/*.html
    const phpURL = "../../API/aeropuertos.php";
    const jsonURL = "../../API/data/paises_aeropuertos.json";

    try {
      const res = await fetch(phpURL, { cache: "no-store" });
      if (res.ok) return res.json();
    } catch (_) {
      // sigue al fallback
    }
    const res = await fetch(jsonURL, { cache: "no-store" });
    return res.json();
  }

  // Vuelos: intenta PHP; si falla (GitHub Pages), genera simulados en cliente
  static async buscarVuelos(params) {
    const query = new URLSearchParams(params).toString();
    const phpURL = `../../API/vuelos.php?${query}`;

    try {
      const res = await fetch(phpURL, { cache: "no-store" });
      if (res.ok) return res.json();
    } catch (_) {
      // fallback a simulación
    }
    return this.simularVuelos(params);
  }

  // Simulación de vuelos cuando no hay PHP (GitHub Pages)
  static simularVuelos({ origen, destino, pasajeros = 1, fechaSalida = "", fechaRegreso = "", tipoViaje = "ida" }) {
    const N = Math.floor(Math.random() * 3) + 3; // 3 a 5 vuelos
    const lista = [];
    const paxs = Number(pasajeros) || 1;

    const baseSalida = fechaSalida ? new Date(fechaSalida) : new Date();
    // Si la fecha viene sin hora razonable, establecemos 12:00 local
    if (baseSalida.getHours() === 0 && baseSalida.getMinutes() === 0) {
      baseSalida.setHours(12, 0, 0, 0);
    }

    for (let i = 0; i < N; i++) {
      const salida = new Date(baseSalida);
      // hora aleatoria 05:00 a 22:59
      salida.setHours(5 + Math.floor(Math.random() * 18), Math.floor(Math.random() * 60), 0, 0);

      let layover = Math.random() < 0.5 ? false : true;
      const durMin = layover ? (240 + Math.floor(Math.random() * 361)) : (60 + Math.floor(Math.random() * 181));
      const llegada = new Date(salida.getTime() + durMin * 60000);

      const price = 200 + Math.floor(Math.random() * 1001); // 200–1200
      const precioTotal = price * paxs;

      const vuelo = {
        from: origen,
        to: destino,
        departure_time: salida.toISOString(),
        arrival_time: llegada.toISOString(),
        layover,
        price,          // precio por pasajero
        precio: price,  // compatibilidad
        precioTotal,    // total
        pasajeros: paxs
      };

      if (tipoViaje === "ida-vuelta" && fechaRegreso) {
        const baseReg = new Date(fechaRegreso);
        if (baseReg.getHours() === 0 && baseReg.getMinutes() === 0) {
          baseReg.setHours(12, 0, 0, 0);
        }
        const sal2 = new Date(baseReg);
        sal2.setHours(5 + Math.floor(Math.random() * 18), Math.floor(Math.random() * 60), 0, 0);
        const lay2 = Math.random() < 0.5 ? false : true;
        const dur2 = lay2 ? (240 + Math.floor(Math.random() * 361)) : (60 + Math.floor(Math.random() * 181));
        const leg2 = new Date(sal2.getTime() + dur2 * 60000);

        vuelo.regreso = {
          from: destino,
          to: origen,
          departure_time: sal2.toISOString(),
          arrival_time: leg2.toISOString(),
          layover: lay2
        };
      }

      lista.push(vuelo);
    }

    // Ordenar por precio ascendente para que el primero sea el más barato
    lista.sort((a, b) => (a.precioTotal ?? a.precio ?? a.price) - (b.precioTotal ?? b.precio ?? b.price));
    return lista;
  }
}
