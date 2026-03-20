<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");


include("../config/database.php");

$sql = "
SELECT q.QID, q.title, q.content, q.is_anon, q.created_at, u.name as user, COUNT(h.UID) as likes, COUNT(a.UID) as answers 
FROM question q LEFT JOIN user u ON q.UID = u.UID 
LEFT JOIN user_heart_question h on q.QID = h.QID
LEFT JOIN answer a ON q.QID = a.QID
GROUP BY q.QID
ORDER BY q.created_at DESC
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
    $row["time"] = date("M d, Y", strtotime($row["created_at"]));
    $row["user"] = ($row["is_anon"] == 1) ? "Anon" : $row["user"];
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
