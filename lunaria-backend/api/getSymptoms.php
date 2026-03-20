<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

include("../config/database.php");

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $uid = $_SESSION["uid"];
    $date = $_GET['date'];


    $sql = "SELECT s.severity, s.notes
FROM symptom s
JOIN period_cycle p ON s.PID = p.PID
WHERE p.start_date = ? AND s.UID =?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $date, $uid);
    $stmt->execute();

    $result = $stmt->get_result();

    $row = mysqli_fetch_assoc($result);

    echo json_encode(["status" => "success", "data" => $row]);
} else {
    echo json_encode([
        "status" => $status,
        "data" => "error occured"
    ]);
}
