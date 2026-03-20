<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json");

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");


include("../config/database.php");

$sql = "
SELECT a.AID, a.title, a.content, a.category, a.created_at, u.name as author, e.specialty as specialty, m.url as image, COUNT(l.UID) as likes  
FROM article a LEFT JOIN article_media m ON a.AID = m.AID 
LEFT JOIN user u ON a.UID = u.UID 
LEFT JOIN expert e ON a.UID = e.UID
LEFT JOIN user_like_article l on a.AID = l.AID
GROUP BY a.AID
ORDER BY a.created_at DESC
";

$result = $conn->query($sql);



if (!$result) {
    echo json_encode([
        "status" => "error",
        "message" => $conn->error
    ]);
    exit;
}



$data = [];



while ($row = $result->fetch_assoc()) {
    $row["description"] = substr($row["content"], 0, 100) . "...";
    $row["tags"] = explode(",", $row["category"]);
    $row["date"] = date("M d, Y", strtotime($row["created_at"]));
    $row["image"] = "http://localhost/lunaria-backend/article/" . $row["image"];
    $data[] = array_map(function ($value) {
        return is_string($value) ? mb_convert_encoding($value, 'UTF-8', 'UTF-8') : $value;
    }, $row);
}

$json = json_encode([
    "status" => "success",
    "data" => $data
]);

if ($json === false) {
    echo json_encode([
        "error" => json_last_error_msg()
    ]);
} else {
    echo $json;
}
