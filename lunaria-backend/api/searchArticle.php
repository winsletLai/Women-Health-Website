<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json");

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");


include("../config/database.php");
$json = file_get_contents('php://input');
$data = json_decode($json, true);

$explicit = $data["allow18"] ?? null;
$search = $data['search'] ?? null;

if ($search == null) {
    json_encode(
        [
            "status" => "error",
            "message" => "invalid input"
        ]
    );
    exit;
}

$search_term = "%" . $search . "%";

if ($explicit) {
    $sql = "
SELECT a.AID, a.title, a.content, a.category, a.created_at, u.name as author, e.specialty as specialty, m.url as image, COUNT(l.UID) as likes  
FROM article a LEFT JOIN article_media m ON a.AID = m.AID 
LEFT JOIN user u ON a.UID = u.UID 
LEFT JOIN expert e ON a.UID = e.UID
LEFT JOIN user_like_article l on a.AID = l.AID
WHERE (a.category LIKE ? OR a.title LIKE ?) 
GROUP BY a.AID
ORDER BY a.created_at DESC
";
} else {
    $sql = "
SELECT a.AID, a.title, a.content, a.category, a.created_at, u.name as author, e.specialty as specialty, m.url as image, COUNT(l.UID) as likes  
FROM article a LEFT JOIN article_media m ON a.AID = m.AID 
LEFT JOIN user u ON a.UID = u.UID 
LEFT JOIN expert e ON a.UID = e.UID
LEFT JOIN user_like_article l on a.AID = l.AID
WHERE (a.category LIKE ? OR a.title LIKE ?) 
AND a.category NOT LIKE '%18+%'
GROUP BY a.AID
ORDER BY a.created_at DESC
";
}

$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $search_term, $search_term);
$stmt->execute();
$result = $stmt->get_result();

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
echo json_encode([
    "status" => "success",
    "data" => $data
]);
