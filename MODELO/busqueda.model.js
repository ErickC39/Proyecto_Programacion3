export default class BusquedaModel {
    static async obtenerAeropuertos() {
        const res = await fetch('/Proyect/Proyecto_Programacion3/API/aeropuertos.php');
        return res.json();
    }
    static async buscarVuelos(params) {
        const query = new URLSearchParams(params).toString();
        const res = await fetch(`/Proyect/Proyecto_Programacion3/API/vuelos.php?${query}`);
        return res.json();
    }
}