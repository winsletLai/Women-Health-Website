<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

include("../config/database.php");

$status = "error";
$message = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    $qid = $data["id"] ?? null;
    $uid = $_SESSION["uid"] ?? null;
    $answer = $data["answer"] ?? null;

    if (!empty($qid) && !empty($uid) && !empty($answer)) {
        $stmt = $conn->prepare("INSERT INTO answer (QID, answer, UID) VALUES (?,?,?) ");
        $stmt->bind_param("isi", $qid, $answer, $uid);
        if ($stmt->execute()) {
            echo json_encode([
                "status" => "success",
                "message" => "success"
            ]);
            exit;
        } else {
            $message = "DB Error";
        }
    } else {
        $message = "Something Wrong occured";
    }
    echo json_encode([
        "status" => $status,
        "message" => $message
    ]);
} else {
    echo json_encode([
        "status" => $status,
        "message" => "Issue occured"
    ]);
}
