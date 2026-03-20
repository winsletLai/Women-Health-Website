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

    $aid = $data["id"] ?? null;
    $uid = $_SESSION["uid"] ?? null;
    $comment = $data["comment"] ?? null;

    if (!empty($aid) && !empty($uid) && !empty($comment)) {
        $stmt = $conn->prepare("INSERT INTO article_comment (AID, comment, UID) VALUES (?,?,?) ");
        $stmt->bind_param("isi", $aid, $comment, $uid);
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
