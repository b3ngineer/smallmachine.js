<?php
ini_set('display_errors',1);
ini_set('error_reporting', E_ALL);

function is_approved($value) {
    return true;
}

// respond to preflights
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  // return only the headers and not the content
  // only allow CORS if we're doing a GET - i.e. no saving for now.
  if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']) &&
       $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'] == 'GET' &&
       isset($_SERVER['HTTP_ORIGIN']) &&
       is_approved($_SERVER['HTTP_ORIGIN'])) {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: X-Requested-With');
  }
  exit;
}

header('Content-Type: application/json');
$arr = array('a' => 1, 'b' => 2, 'c' => 3, 'd' => 4, 'e' => 5);
echo json_encode($arr);
?>
