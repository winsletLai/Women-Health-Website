<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

include("../config/database.php");

if ($_SERVER["REQUEST_METHOD"] === "GET") {

    $aid = $_GET["aid"] ?? null;

    if (!$aid) {
        echo json_encode(["status" => "error", "message" => "No AID"]);
        exit;
    }

    $sql = "SELECT 
                ac.ACID,
                ac.comment,
                ac.created_at,
                u.name,
                u.img
            FROM article_comment ac
            LEFT JOIN user u ON ac.UID = u.UID
            WHERE ac.AID = ?
            ORDER BY ac.created_at DESC";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $aid);
    $stmt->execute();

    $result = $stmt->get_result();

    $comments = [];

    while ($row = $result->fetch_assoc()) {
        $row["created_at"] = date("M d, Y", strtotime($row["created_at"]));
        $row["img"] = "http://localhost/lunaria-backend/profile/" . $row["img"];
        $comments[] = $row;
    }

    echo json_encode([
        "status" => "success",
        "data" => $comments
    ]);
}
