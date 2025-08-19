<?php
// filepath: api/vuelos.php
header('Content-Type: application/json');

// Recibe parámetros
$origen = $_GET['origen'] ?? '';
$destino = $_GET['destino'] ?? '';
$pasajeros = intval($_GET['pasajeros'] ?? 1);
$fechaSalida = $_GET['fechaSalida'] ?? '';
$fechaRegreso = $_GET['fechaRegreso'] ?? '';
$tipoViaje = $_GET['tipoViaje'] ?? 'ida';

// Puedes usar el archivo viaje_paises.json si quieres simular vuelos reales
// $data = json_decode(file_get_contents(__DIR__ . '/data/viaje_paises.json'), true);

// Simula vuelos (puedes mejorar la lógica según tus necesidades)
function generarVuelo($from, $to, $fecha) {
    $salida = strtotime($fecha ?: 'now');
    $duracion = rand(2, 12) * 60 * 60; // entre 2 y 12 horas
    $llegada = $salida + $duracion;
    $layover = rand(0, 1) === 1;
    $price = rand(100, 1500);
    return [
        'from' => $from,
        'to' => $to,
        'departure_time' => date('c', $salida),
        'arrival_time' => date('c', $llegada),
        'layover' => $layover,
        'price' => $price,
        'precioTotal' => $price * $GLOBALS['pasajeros']
    ];
}

$vuelos = [];
if ($origen && $destino && $origen !== $destino) {
    // Simula 3 vuelos de ida
    for ($i = 0; $i < 3; $i++) {
        $vuelo = generarVuelo($origen, $destino, $fechaSalida);
        // Si es ida y vuelta, agrega info de regreso
        if ($tipoViaje === 'ida-vuelta' && $fechaRegreso) {
            $vuelo['regreso'] = generarVuelo($destino, $origen, $fechaRegreso);
        }
        $vuelos[] = $vuelo;
    }
}

// Devuelve el array como JSON
echo json_encode($vuelos);