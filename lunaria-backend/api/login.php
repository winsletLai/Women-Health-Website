<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

include("../config/database.php");

$status = "error";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"));

    $email = $data->email;
    $password = $data->password;

    $message = "";

    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $stmt = $conn->prepare("SELECT * FROM user WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();
        if ($result->num_rows > 0) {
            $row = mysqli_fetch_assoc($result);

            $pattern = '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/';
            if (preg_match($pattern, $password)) {
                if (password_verify($password, $row['passwd'])) {
                    $_SESSION["uid"] = $row["UID"];
                    $status = "success";
                    $message = "Welcome - Name: " . $row["name"];
                } else {
                    $message = "password incorrect";
                }
            } else {
                $message = "password must be at least 8 characters long contain a number and an uppercase letter.";
            }
        } else {
            $message = "The email hasn't been registered.";
        }
    } else {
        $message = $email . " is an invalid email";
    }

    $response = [
        "status" => $status,
        "message" => $message
    ];

    echo json_encode($response);
} else {
    echo json_encode([
        "status" => $status,
        "message" => "error occured"
    ]);
}
