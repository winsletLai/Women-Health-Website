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

    $sql = "SELECT q.QID, q.title, q.content as description, q.is_anon, q.created_at, u.name as user, COUNT(h.UID) as likes
            FROM question q LEFT JOIN user u ON q.UID = u.UID 
            LEFT JOIN user_heart_question h on q.QID = h.QID
            LEFT JOIN answer a ON q.QID = a.QID
            WHERE q.QID = ?
            GROUP BY q.QID";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $qid);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        $row["date"] = date("M d, Y", strtotime($row["created_at"]));
        $row["user"] = ($row["is_anon"] == 1) ? "Anon" : $row["user"];
        echo json_encode([
            "status" => "success",
            "data" => $row
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Question not found"
        ]);
    }
}
