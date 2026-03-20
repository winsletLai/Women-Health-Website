<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

include("../config/database.php");

$status = "error";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"));

    $start_date = $data->date; // from calendar
    $flow = $data->flow ?? "";
    $notes = $data->notes ?? "";

    $uid = $_SESSION["uid"];

    //default
    $period_days = 5;
    $default_cycle = 28;

    $start = new DateTime($start_date);

    $end = clone $start;
    $end->modify("+" . ($period_days - 1) . " days");

    $sqlPrev = "SELECT start_date FROM period_cycle 
                WHERE UID = ? 
                ORDER BY start_date DESC LIMIT 1";

    $stmtPrev = $conn->prepare($sqlPrev);
    $stmtPrev->bind_param("i", $uid);
    $stmtPrev->execute();
    $resultPrev = $stmtPrev->get_result();

    $cycle_length = $default_cycle;

    if ($resultPrev->num_rows > 0) {
        $rowPrev = $resultPrev->fetch_assoc();
        $prevStart = new DateTime($rowPrev['start_date']);
        $cycle_length = $start->diff($prevStart)->days;
    }


    $sqlAvg = "SELECT AVG(cycle_length) as avg_cycle 
               FROM period_cycle WHERE UID = ?";

    $stmtAvg = $conn->prepare($sqlAvg);
    $stmtAvg->bind_param("i", $uid);
    $stmtAvg->execute();
    $resultAvg = $stmtAvg->get_result();
    $rowAvg = $resultAvg->fetch_assoc();

    $avg_cycle = $rowAvg['avg_cycle'] ? round($rowAvg['avg_cycle']) : $default_cycle;


    $next_period = clone $start;
    $next_period->modify("+$avg_cycle days");


    $ovulation = clone $next_period;
    $ovulation->modify("-14 days");


    $sql = "INSERT INTO period_cycle 
    (UID, start_date, end_date, cycle_length, predict_next_period, predict_ovulation) 
    VALUES (?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);

    $start_f = $start->format("Y-m-d");
    $end_f = $end->format("Y-m-d");
    $next_f = $next_period->format("Y-m-d");
    $ovu_f = $ovulation->format("Y-m-d");

    $stmt->bind_param("ississ", $uid, $start_f, $end_f, $cycle_length, $next_f, $ovu_f);

    if ($stmt->execute()) {

        if (!empty($flow) || !empty($notes)) {

            $pid = $conn->insert_id;

            $type = "flow";

            $sql2 = "INSERT INTO symptom (PID, UID, stype, severity, notes)
                 VALUES (?, ?, ?, ?, ?)";

            $stmt2 = $conn->prepare($sql2);
            $stmt2->bind_param("issss", $pid, $uid, $type, $flow, $notes);
            $stmt2->execute();
        }

        echo json_encode([
            "status" => "success",
            "message" => "Period added, Refresh the page and view",
            "data" => [
                "start" => $start_f,
                "end" => $end_f,
                "next_period" => $next_f,
                "ovulation" => $ovu_f
            ]
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => $stmt->error]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request"]);
}
