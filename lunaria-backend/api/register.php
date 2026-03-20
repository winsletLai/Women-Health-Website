<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

include("../config/database.php");

$status = "error";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"));

    $email = $data->email ?? '';
    $password = $data->password ?? '';

    $message = "";

    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {

        $stmt = $conn->prepare("SELECT * FROM user WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();
        if ($result->num_rows > 0) {
            $message = "$email - This email has already registered.";
        } else {
            $pattern = '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/';
            if (preg_match($pattern, $password)) {
                $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
                $name = "user";
                $img = "default.png";
                $role = "general";

                $stmt1 = $conn->prepare("INSERT INTO user (email, name, img, passwd, role) VALUES (?, ?, ?, ?, ?)");
                $stmt1->bind_param("sssss", $email, $name, $img, $hashedPassword, $role);

                if ($stmt1->execute()) {
                    $stmt2 = $conn->prepare("SELECT * FROM user WHERE email = ?");
                    $stmt2->bind_param("s", $email);
                    $stmt2->execute();
                    $result2 = $stmt2->get_result();
                    $stmt2->close();
                    if ($result2->num_rows > 0) {
                        $row = mysqli_fetch_assoc($result2);
                        $uid = $row["UID"];
                        $stmt3 = $conn->prepare("INSERT INTO general (UID) VALUES (?)");
                        $stmt3->bind_param("s", $uid);
                        if ($stmt3->execute()) {
                            $status = "success";
                            $message = "Successful Registration";
                        } else {
                            $message = "DB Error: " . $stmt3->error;
                        }
                    } else {
                        $message = "Something went wrong.";
                    }
                } else {
                    $message = "DB Error: " . $stmt1->error;
                }
                $stmt1->close();
            } else {
                $message = "password must be at least 8 characters long contain a number and an uppercase letter.";
            }
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
