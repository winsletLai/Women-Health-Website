<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

include("../config/database.php");

$status = "error";

if ($_SERVER["REQUEST_METHOD"] === "GET") {

    $uid = $_SESSION["uid"] ?? null;

    if (!$uid) {
        echo json_encode([]);
        exit;
    }
    $stmt = $conn->prepare("SELECT * FROM user WHERE UID = ?");
    $stmt->bind_param("s", $uid);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    if ($result->num_rows > 0) {
        $row = mysqli_fetch_assoc($result);
        echo json_encode($row);
    } else {
        $response = [
            "status" => $status,
            "message" => "failed"
        ];
        echo json_encode($response);
    }
} else {
    echo json_encode([
        "status" => $status,
        "message" => "error occured"
    ]);
}
