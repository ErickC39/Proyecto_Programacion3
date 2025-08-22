<?php
header('Content-Type: application/json');

// Parámetros
$origen = $_GET['origen'] ?? 'SJO';
$destino = $_GET['destino'] ?? 'MIA';
$pasajeros = isset($_GET['pasajeros']) ? max(1, (int)$_GET['pasajeros']) : 1;
$fechaSalida = $_GET['fechaSalida'] ?? '';
$fechaRegreso = $_GET['fechaRegreso'] ?? '';
$tipoViaje = $_GET['tipoViaje'] ?? 'ida';

// Normaliza fecha de salida: si viene vacía, hoy
try {
  $salidaBase = $fechaSalida ? new DateTime($fechaSalida) : new DateTime();
} catch (Exception $e) {
  $salidaBase = new DateTime();
}
// Si vino sin hora útil, fijar 12:00 para evitar desfase (por si pasan YYYY-MM-DD)
if ((int)$salidaBase->format('H') === 0 && (int)$salidaBase->format('i') === 0) {
  $salidaBase->setTime(12, 0);
}

// Si hay regreso, normaliza
$regresoBase = null;
if ($tipoViaje === 'ida-vuelta' && !empty($fechaRegreso)) {
  try {
    $regresoBase = new DateTime($fechaRegreso);
  } catch (Exception $e) {
    $regresoBase = null;
  }
  if ($regresoBase && (int)$regresoBase->format('H') === 0 && (int)$regresoBase->format('i') === 0) {
    $regresoBase->setTime(12, 0);
  }
}

// Genera N vuelos
$N = rand(3, 5);
$resultados = [];

for ($i = 0; $i < $N; $i++) {
  // Hora aleatoria salida (05:00–22:59)
  $salidaDT = clone $salidaBase;
  $horaSalida = rand(5, 22);
  $minSalida = rand(0, 59);
  $salidaDT->setTime($horaSalida, $minSalida);

  // Duración: directo 60–240 min, con escala 240–600 min
  $layover = (bool)rand(0, 1);
  $duracionMin = $layover ? rand(240, 600) : rand(60, 240);

  $llegadaDT = clone $salidaDT;
  $llegadaDT->modify("+$duracionMin minutes");

  $precioPorPasajero = rand(200, 1200);
  $precioTotal = $precioPorPasajero * $pasajeros;

  $vuelo = [
    "from" => $origen,
    "to" => $destino,
    "departure_time" => $salidaDT->format(DATE_ATOM),
    "arrival_time" => $llegadaDT->format(DATE_ATOM),
    "layover" => $layover,
    "price" => $precioPorPasajero,
    "precio" => $precioPorPasajero,  // compat
    "precioTotal" => $precioTotal
  ];

  if ($tipoViaje === 'ida-vuelta' && $regresoBase instanceof DateTime) {
    $sal2 = clone $regresoBase;
    $sal2->setTime(rand(5, 22), rand(0, 59));

    $lay2 = (bool)rand(0, 1);
    $dur2 = $lay2 ? rand(240, 600) : rand(60, 240);
    $leg2 = clone $sal2;
    $leg2->modify("+$dur2 minutes");

    $vuelo["regreso"] = [
      "from" => $destino,
      "to" => $origen,
      "departure_time" => $sal2->format(DATE_ATOM),
      "arrival_time" => $leg2->format(DATE_ATOM),
      "layover" => $lay2
    ];
  }

  $resultados[] = $vuelo;
}

// Ordenar por precio total ascendente
usort($resultados, function($a, $b) {
  $pa = $a["precioTotal"] ?? $a["precio"] ?? $a["price"] ?? 0;
  $pb = $b["precioTotal"] ?? $b["precio"] ?? $b["price"] ?? 0;
  return $pa <=> $pb;
});

echo json_encode($resultados);
