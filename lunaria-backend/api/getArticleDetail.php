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
                a.AID, 
                a.title, 
                a.content as description, 
                a.category, 
                a.created_at, 
                u.name as author, 
                e.specialty as specialty, 
                m.url as image, 
                COUNT(l.UID) as likes  
            FROM article a 
            LEFT JOIN article_media m ON a.AID = m.AID 
            LEFT JOIN user u ON a.UID = u.UID 
            LEFT JOIN expert e ON a.UID = e.UID
            LEFT JOIN user_like_article l on a.AID = l.AID
            WHERE a.AID = ?
            GROUP BY a.AID";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $aid);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        $row["date"] = date("M d, Y", strtotime($row["created_at"]));
        $row["image"] = "http://localhost/lunaria-backend/article/" . $row["image"];

        echo json_encode([
            "status" => "success",
            "data" => $row
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Article not found"
        ]);
    }
}
