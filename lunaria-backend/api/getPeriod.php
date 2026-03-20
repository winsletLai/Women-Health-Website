<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

include("../config/database.php");

if ($_SERVER["REQUEST_METHOD"] === "GET") {

    $uid = $_SESSION["uid"];

    $sql = "SELECT start_date, end_date, predict_next_period, predict_ovulation 
        FROM period_cycle WHERE UID = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $uid);
    $stmt->execute();

    $result = $stmt->get_result();

    $data = [];

    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode(["status" => "success", "data" => $data]);
} else {
    echo json_encode([
        "status" => $status,
        "data" => "error occured"
    ]);
}
