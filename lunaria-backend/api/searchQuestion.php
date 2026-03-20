<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");


include("../config/database.php");
$json = file_get_contents('php://input');
$data = json_decode($json, true);

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


$sql = "
SELECT q.QID, q.title, q.content, q.is_anon, q.created_at, u.name as user, COUNT(h.UID) as likes, COUNT(a.UID) as answers 
FROM question q LEFT JOIN user u ON q.UID = u.UID 
LEFT JOIN user_heart_question h on q.QID = h.QID
LEFT JOIN answer a ON q.QID = a.QID
WHERE q.title LIKE ?
GROUP BY q.QID
ORDER BY q.created_at DESC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $search_term);
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
    $row["time"] = date("M d, Y", strtotime($row["created_at"]));
    $row["user"] = ($row["is_anon"] == 1) ? "Anon" : $row["user"];
    $data[] = array_map(function ($value) {
        return is_string($value) ? mb_convert_encoding($value, 'UTF-8', 'UTF-8') : $value;
    }, $row);
}
echo json_encode([
    "status" => "success",
    "data" => $data
]);
