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

    if (!empty($qid) && !empty($uid)) {

        $stmt = $conn->prepare("SELECT * FROM user_heart_question WHERE UID = ? AND QID = ?");
        $stmt->bind_param("ii", $uid, $qid);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();
        if ($result->num_rows > 0) {
            $stmt = $conn->prepare("DELETE FROM user_heart_question WHERE UID = ? AND QID = ?");
            $stmt->bind_param("ii", $uid, $qid);
            if ($stmt->execute()) {
                echo json_encode([
                    "status" => "success",
                    "message" => "success"
                ]);
            } else {
                $message = "DB error";
            }
        } else {
            $stmt = $conn->prepare("INSERT INTO user_heart_question (UID, QID) VALUES (?,?) ");
            $stmt->bind_param("ii", $uid, $qid);
            if ($stmt->execute()) {
                echo json_encode([
                    "status" => "success",
                    "message" => "success"
                ]);
            } else {
                $message = "DB error";
            }
        }
    } else {
        echo json_encode([
            "status" => $status,
            "message" => "Log in"
        ]);
        exit();
    }
}

if ($_SERVER["REQUEST_METHOD"] === "GET") {

    $qid = $_GET["qid"] ?? null;

    if (!$qid) {
        echo json_encode(["status" => "error", "message" => "No QID"]);
        exit;
    }

    $uid = $_SESSION["uid"] ?? null;

    if (!empty($qid) && !empty($uid)) {
        $stmt = $conn->prepare("SELECT * FROM user_heart_question WHERE UID = ? AND QID = ?");
        $stmt->bind_param("ii", $uid, $qid);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();
        if ($result->num_rows > 0) {
            echo json_encode(["like" => true]);
        } else {
            echo json_encode(["like" => false]);
        }
    } else {
        echo json_encode([
            "status" => $status,
            "message" => "Log in"
        ]);
        exit();
    }
}
