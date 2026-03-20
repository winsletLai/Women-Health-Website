<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

include("../config/database.php");

$_SESSION = array();

session_destroy();

echo json_encode([
    "status" => "success",
    "message" => "Logout successful"
]);
exit();
