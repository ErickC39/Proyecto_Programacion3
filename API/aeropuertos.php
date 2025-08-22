<?php
// Esta línea establece el tipo de contenido de la respuesta como JSON.
header('Content-Type: application/json');

// Esta función lee y devuelve el contenido de un archivo JSON.
// El archivo contiene datos sobre países y aeropuertos.
echo file_get_contents(__DIR__ . '/data/paises_aeropuertos.json');