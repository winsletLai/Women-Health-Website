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

    if (!empty($aid) && !empty($uid)) {

        $stmt = $conn->prepare("SELECT * FROM user_like_article WHERE UID = ? AND AID = ?");
        $stmt->bind_param("ii", $uid, $aid);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();
        if ($result->num_rows > 0) {
            $stmt = $conn->prepare("DELETE FROM user_like_article WHERE UID = ? AND AID = ?");
            $stmt->bind_param("ii", $uid, $aid);
            if ($stmt->execute()) {
                echo json_encode([
                    "status" => "success",
                    "message" => "success"
                ]);
            } else {
                $message = "DB error";
            }
        } else {
            $stmt = $conn->prepare("INSERT INTO user_like_article (UID, AID) VALUES (?,?) ");
            $stmt->bind_param("ii", $uid, $aid);
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

    $aid = $_GET["aid"] ?? null;

    if (!$aid) {
        echo json_encode(["status" => "error", "message" => "No AID"]);
        exit;
    }

    $uid = $_SESSION["uid"] ?? null;
    if (!empty($aid) && !empty($uid)) {
        $stmt = $conn->prepare("SELECT * FROM user_like_article WHERE UID = ? AND AID = ?");
        $stmt->bind_param("ii", $uid, $aid);
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
