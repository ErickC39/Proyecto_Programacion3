<?php
// filepath: api/aeropuertos.php
header('Content-Type: application/json');

// Devuelve el contenido del JSON de aeropuertos
echo file_get_contents(__DIR__ . '/data/paises_aeropuertos.json');