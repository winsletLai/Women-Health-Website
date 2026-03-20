<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

include("../config/database.php");

if ($_SERVER["REQUEST_METHOD"] === "GET") {

    $qid = $_GET["qid"] ?? null;

    if (!$qid) {
        echo json_encode(["status" => "error", "message" => "No QID"]);
        exit;
    }

    $sql = "SELECT 
                a.ANID,
                a.answer,
                a.created_at,
                u.name,
                u.img
            FROM answer a
            LEFT JOIN user u ON a.UID = u.UID
            WHERE a.QID = ?
            ORDER BY a.created_at DESC";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $qid);
    $stmt->execute();

    $result = $stmt->get_result();

    $answers = [];

    while ($row = $result->fetch_assoc()) {
        $row["created_at"] = date("M d, Y", strtotime($row["created_at"]));
        $row["img"] = "http://localhost/lunaria-backend/profile/" . $row["img"];
        $answers[] = $row;
    }

    echo json_encode([
        "status" => "success",
        "data" => $answers
    ]);
}
