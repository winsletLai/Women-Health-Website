<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

include("../config/database.php");

if (!isset($_SESSION['uid'])) {
    echo json_encode(["status" => "error", "message" => "Not logged in"]);
    exit;
}

$uid = $_SESSION['uid'];
$sql = "SELECT user_input, suggestion FROM assist_log WHERE UID = ? ORDER BY LID ASC";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $uid);
$stmt->execute();
$result = $stmt->get_result();

$history = [];
while ($row = $result->fetch_assoc()) {
    $history[] = ["role" => "user", "text" => $row['user_input']];
    $history[] = ["role" => "bot", "text" => $row['suggestion']];
}

echo json_encode(["status" => "success", "history" => $history]);
