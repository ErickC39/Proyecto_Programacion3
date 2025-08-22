<?php
// Esta línea establece el tipo de contenido de la respuesta como JSON.
header('Content-Type: application/json');

// --- Parámetros de la solicitud ---

// Obtiene los parámetros de la URL y les asigna valores por defecto si no existen.
$origen = $_GET['origen'] ?? 'SJO';
$destino = $_GET['destino'] ?? 'MIA';
$pasajeros = isset($_GET['pasajeros']) ? max(1, (int)$_GET['pasajeros']) : 1;
$fechaSalida = $_GET['fechaSalida'] ?? '';
$fechaRegreso = $_GET['fechaRegreso'] ?? '';
$tipoViaje = $_GET['tipoViaje'] ?? 'ida';

// --- Normalización de fechas ---

// Crea un objeto de fecha para la salida, usando la fecha de la URL o la fecha actual si no se especifica.
try {
  $salidaBase = $fechaSalida ? new DateTime($fechaSalida) : new DateTime();
} catch (Exception $e) {
  $salidaBase = new DateTime();
}
// Ajusta la hora de la fecha de salida a las 12:00 para evitar problemas de zona horaria.
if ((int)$salidaBase->format('H') === 0 && (int)$salidaBase->format('i') === 0) {
  $salidaBase->setTime(12, 0);
}

// Inicializa la variable de la fecha de regreso.
$regresoBase = null;
// Procesa la fecha de regreso solo si el viaje es de ida y vuelta y la fecha está presente.
if ($tipoViaje === 'ida-vuelta' && !empty($fechaRegreso)) {
  try {
    $regresoBase = new DateTime($fechaRegreso);
  } catch (Exception $e) {
    $regresoBase = null;
  }
  // Ajusta la hora de la fecha de regreso a las 12:00 si es necesario.
  if ($regresoBase && (int)$regresoBase->format('H') === 0 && (int)$regresoBase->format('i') === 0) {
    $regresoBase->setTime(12, 0);
  }
}

// --- Generación de datos de vuelos ---

// Genera un número aleatorio de vuelos entre 3 y 5.
$N = rand(3, 5);
// Inicializa un arreglo para almacenar los resultados de los vuelos.
$resultados = [];

// Bucle para generar cada vuelo individualmente.
for ($i = 0; $i < $N; $i++) {
  // Clona el objeto de la fecha de salida y establece una hora aleatoria.
  $salidaDT = clone $salidaBase;
  $horaSalida = rand(5, 22);
  $minSalida = rand(0, 59);
  $salidaDT->setTime($horaSalida, $minSalida);

  // Determina si el vuelo tiene escala y calcula una duración aleatoria.
  $layover = (bool)rand(0, 1);
  $duracionMin = $layover ? rand(240, 600) : rand(60, 240);

  // Clona la fecha de salida y añade la duración para obtener la fecha de llegada.
  $llegadaDT = clone $salidaDT;
  $llegadaDT->modify("+$duracionMin minutes");

  // Calcula el precio por pasajero y el precio total.
  $precioPorPasajero = rand(200, 1200);
  $precioTotal = $precioPorPasajero * $pasajeros;

  // Crea un arreglo asociativo con los datos del vuelo de ida.
  $vuelo = [
    "from" => $origen,
    "to" => $destino,
    "departure_time" => $salidaDT->format(DATE_ATOM),
    "arrival_time" => $llegadaDT->format(DATE_ATOM),
    "layover" => $layover,
    "price" => $precioPorPasajero,
    "precio" => $precioPorPasajero,
    "precioTotal" => $precioTotal
  ];

  // Agrega datos de un vuelo de regreso si el viaje es de ida y vuelta.
  if ($tipoViaje === 'ida-vuelta' && $regresoBase instanceof DateTime) {
    // Clona la fecha de regreso y establece una hora aleatoria.
    $sal2 = clone $regresoBase;
    $sal2->setTime(rand(5, 22), rand(0, 59));

    // Determina la escala y duración del vuelo de regreso.
    $lay2 = (bool)rand(0, 1);
    $dur2 = $lay2 ? rand(240, 600) : rand(60, 240);
    $leg2 = clone $sal2;
    $leg2->modify("+$dur2 minutes");

    // Crea un arreglo con los datos del vuelo de regreso.
    $vuelo["regreso"] = [
      "from" => $destino,
      "to" => $origen,
      "departure_time" => $sal2->format(DATE_ATOM),
      "arrival_time" => $leg2->format(DATE_ATOM),
      "layover" => $lay2
    ];
  }

  // Añade el vuelo generado al arreglo de resultados.
  $resultados[] = $vuelo;
}

// --- Ordenamiento y respuesta ---

// Ordena los vuelos por precio total de forma ascendente.
usort($resultados, function($a, $b) {
  $pa = $a["precioTotal"] ?? $a["precio"] ?? $a["price"] ?? 0;
  $pb = $b["precioTotal"] ?? $b["precio"] ?? $b["price"] ?? 0;
  return $pa <=> $pb;
});

// Convierte el arreglo de resultados a formato JSON y lo muestra.
echo json_encode($resultados);