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

    $title = $data["title"] ?? null;
    $description = $data["description"] ?? null;
    $anon = $data["anon"] ?? false;


    $uid = "";
    if (!isset($_SESSION["uid"])) {
        echo json_encode(["status" => $status, "message" => "User not logged in"]);
        exit;
    } else {
        $uid = $_SESSION["uid"];
    }

    $isAnon = $anon ? 1 : 0;

    if (!empty($title) && !empty($description)) {
        $stmt = $conn->prepare("INSERT INTO question (title, content, is_anon, UID) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssii", $title, $description, $isAnon, $uid);
        if ($stmt->execute()) {
            $status = "success";
            $message = "Successful Upload";
        } else {
            $message = "DB Error: " . $stmt->error;
        }
    } else {
        $message = "Title and description can't be empty";
    }
    echo json_encode([
        "status" => $status,
        "message" => $message
    ]);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request"]);
}
