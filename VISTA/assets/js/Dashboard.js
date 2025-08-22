// Espera a que el contenido del documento HTML se haya cargado completamente.
document.addEventListener("DOMContentLoaded", function () {
  // Define un arreglo de objetos que representan los destinos de viaje con su nombre y código de aeropuerto.
  const destinos = [
    { nombre: "Japón", codigo: "NRT" },
    { nombre: "Nueva York", codigo: "JFK" },
    { nombre: "Suiza", codigo: "ZRH" },
    { nombre: "Tailandia", codigo: "BKK" },
    { nombre: "París", codigo: "CDG" },
    { nombre: "Dubái", codigo: "DXB" },
    { nombre: "Mónaco", codigo: "NCE" },
    { nombre: "Londres", codigo: "LHR" }
  ];

  // Genera un número de visitas aleatorio para cada destino.
  destinos.forEach(d => d.visitas = Math.floor(Math.random() * 1000) + 100);

  // --- Llenar la tabla ---

  // Obtiene el cuerpo de la tabla.
  const tbody = document.querySelector("#tabla-destinos");
  // Ordena los destinos de mayor a menor según el número de visitas.
  destinos
    .sort((a, b) => b.visitas - a.visitas)
    // Itera sobre cada destino y crea una fila para la tabla.
    .forEach(d => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${d.nombre}</td><td>${d.visitas}</td>`;
      // Añade la fila a la tabla.
      tbody.appendChild(tr);
    });


  // --- Gráfico de barras ---

  // Define una paleta de colores personalizada para el gráfico.
  const colores = [
    "#ffb53a", // dorado
    "#4e5d94", // azul profundo
    "#121274ff", // azul oscuro
    "#ffb53a", // azul intermedio
    "#4e5d94", // dorado claro
    "#121274ff", // azul grisáceo
    "#ffb53a", // dorado opaco
    "#4e5d94"  // azul grisáceo claro
  ];

  // Obtiene el contexto del elemento canvas para dibujar el gráfico.
  const ctx = document.getElementById('graficoDestinos').getContext('2d');
  // Crea una nueva instancia de Chart.js para un gráfico de barras.
  new Chart(ctx, {
    // Especifica el tipo de gráfico.
    type: 'bar',
    // Define los datos a mostrar en el gráfico.
    data: {
      // Usa los nombres de los destinos como etiquetas del eje X.
      labels: destinos.map(d => d.nombre),
      datasets: [{
        label: 'Visitas',
        // Usa el número de visitas como los valores de las barras.
        data: destinos.map(d => d.visitas),
        // Asigna los colores definidos a las barras.
        backgroundColor: colores,
        // Define el radio de las esquinas de las barras.
        borderRadius: 8
      }]
    },
    // Configura las opciones del gráfico.
    options: {
      // Hace que el gráfico sea responsivo al tamaño de la ventana.
      responsive: true,
      plugins: {
        // Oculta la leyenda del gráfico.
        legend: { display: false }
      },
      scales: {
        // Configura el eje X.
        x: {
          ticks: {
            color: "#ffb53a",
            font: { size: 18 }
          },
          grid: { color: "#172a4a" }
        },
        // Configura el eje Y.
        y: {
          beginAtZero: true,
          ticks: {
            color: "#ffb53a",
            font: { size: 18 }
          },
          grid: { color: "#172a4a" }
        }
      }
    }
  });
});