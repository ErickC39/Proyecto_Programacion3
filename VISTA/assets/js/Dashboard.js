document.addEventListener("DOMContentLoaded", function () {
  // Destinos del código
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

  // Generar visitas random
  destinos.forEach(d => d.visitas = Math.floor(Math.random() * 1000) + 100);

  // Llenar tabla
  const tbody = document.querySelector("#tabla-destinos");
  destinos
    .sort((a, b) => b.visitas - a.visitas)
    .forEach(d => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${d.nombre}</td><td>${d.visitas}</td>`;
      tbody.appendChild(tr);
    });


  // Paleta de colores personalizada
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

  // Gráfico de barras
const ctx = document.getElementById('graficoDestinos').getContext('2d');
new Chart(ctx, {
  type: 'bar',
  data: {
    labels: destinos.map(d => d.nombre),
    datasets: [{
      label: 'Visitas',
      data: destinos.map(d => d.visitas),
      backgroundColor: colores,
      borderRadius: 8
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        ticks: { 
          color: "#ffb53a",  
          font: { size: 18 }  // tamaño letra eje X
        },
        grid: { color: "#172a4a" } 
      },
      y: {
        beginAtZero: true,
        ticks: { 
          color: "#ffb53a",   
          font: { size: 18 }  // tamaño letra eje Y
        },
        grid: { color: "#172a4a" } 
      }
    }
  }
});
});