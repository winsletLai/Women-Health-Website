<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

include("../config/database.php");

$api_key = "Your API key";

$url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=$api_key";


$status = "error";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"));

    $inputMessage = $data->inputMessage;
    $user_message = trim($inputMessage);



    if (empty($user_message)) {
        echo json_encode(["status" => $status, "message" => "Invalid input"]);
        exit;
    }

    $system_prompt = "You are Luna, a black cat with a golden crescent moon symbol on your forehead. You are the wise mascot of this women's health website named Lunaria. 
    Your persona is a professional yet gentle gynecologist and obstetrician. 
    1. Only answer questions related to women's health, pregnancy, and reproductive wellness. 
    2. If a user asks about unrelated topics (weather, stocks, sports, etc.), politely decline and steer them back to health topics.
    3. Use a supportive, feline-inspired but clinical tone.
    4. Do Not include actions in your response (twitchy whisker, purring) think of it as texting between you and user
    5. Keep the answer simple, concise and easy to understand as audience might not be from a medical background";

    $data = [
        "system_instruction" => [
            "parts" => [
                ["text" => $system_prompt]
            ]
        ],
        "contents" => [
            [
                "parts" => [
                    ['text' => $user_message]
                ]
            ]
        ]
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);


    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);


    if ($http_code === 200) {
        $response_data = json_decode($response, true);
        $ai_response = trim($response_data['candidates'][0]['content']['parts'][0]['text']);

        if (isset($_SESSION['uid'])) {
            $uid = $_SESSION['uid'];
            $stmt = $conn->prepare("INSERT INTO assist_log (UID, user_input, suggestion) VALUES (?, ?, ?)");
            $stmt->bind_param("iss", $uid, $user_message, $ai_response);
            $stmt->execute();
            $stmt->close();
        }

        echo json_encode(['status' => "success", 'response' => $ai_response]);
    } else {
        echo json_encode(['error' => 'Google Gemini API error']);
        exit;
    }
} else {
    echo json_encode([
        "status" => $status,
        "message" => "error occured"
    ]);
}
