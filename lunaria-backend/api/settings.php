<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

include("../config/database.php");

$status = "error";
$message = "";
$uploadDir = "../profile/";
$uploadCertDir = "../cert/";

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $email = $_POST["email"] ?? null;
    $password = $_POST["password"] ?? null;
    $name = $_POST["name"] ?? null;

    $specialty = $_POST["specialty"] ?? null;

    $set = [];
    $parameters = [];
    $uid = isset($_SESSION["uid"]) ? $_SESSION["uid"] : null;

    if (!$uid) {
        echo json_encode(["status" => "error", "message" => "Not logged in"]);
        exit;
    }

    // Check if the 'name' field has a value and add to update list if so
    if (!empty($name)) {
        $set[] = 'name = ?';
        $parameters[] = $name;
    }

    if (isset($_FILES["profile"]) && $_FILES["profile"]["error"] === 0) {
        $file = $_FILES["profile"];
        $imageFileType = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));
        if ($imageFileType == "jpg" || $imageFileType == "png" || $imageFileType == "jpeg") {
            $profileName = time() . "_" . basename($file["name"]);
            $targetFile = $uploadDir . $profileName;
            move_uploaded_file($file["tmp_name"], $targetFile);
            $set[] = 'img = ?';
            $parameters[] = $profileName;
        } else {
            echo json_encode([
                "status" => "error",
                "message" => "Only JPG PNG JPEG allowed"
            ]);
            exit;
        }
    }

    if (!empty($email)) {
        if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $set[] = 'email = ?';
            $parameters[] = $email;
        } else {
            echo json_encode(["status" => "error", "message" => "Invalid email format"]);
            exit;
        }
    }

    if (!empty($password)) {
        $pattern = '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/';
        if (preg_match($pattern, $password)) {
            $set[] = 'passwd = ?';
            $parameters[] = password_hash($password, PASSWORD_DEFAULT);
        } else {
            echo json_encode(["status" => "error", "message" => "Password too weak"]);
            exit;
        }
    }

    // If there's anything to update, run the query
    if (count($set) > 0) {
        $sql = "UPDATE user SET " . implode(', ', $set) . " WHERE UID = ?";
        $parameters[] = $uid;

        $stmt = $conn->prepare($sql);
        $types = str_repeat('s', count($parameters) - 1) . 'i';
        $stmt->bind_param($types, ...$parameters);

        if ($stmt->execute()) {
            $status = "success";
            $message = "Profile updated successfully!";
        } else {
            $message = "DB Error: " . $stmt->error;
        }

        $stmt->close();
    } else {
        if (!empty($specialty) && isset($_FILES["file"]) && $_FILES["file"]["error"] === 0) {
            $file = $_FILES["file"];
            $fileType = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));
            if ($fileType == "pdf") {
                $fileName = time() . "_" . basename($file["name"]);
                $targetFile = $uploadCertDir . $fileName;
                move_uploaded_file($file["tmp_name"], $targetFile);

                $role = "expert";
                $sql = "UPDATE user SET role = ? WHERE UID = ?";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("ss", $role, $uid);
                if ($stmt->execute()) {
                    $stmt1 = $conn->prepare("INSERT INTO expert (UID, cert, specialty) VALUES (?, ?, ?)");
                    $stmt1->bind_param("sss", $uid, $fileName, $specialty);
                    if ($stmt1->execute()) {
                        $status = "success";
                        $message = "Application was successful!";
                    } else {
                        $message = "DB Error: " . $stmt->error;
                    }
                } else {
                    $message = "DB Error: " . $stmt->error;
                }

                $stmt->close();
            } else {
                echo json_encode([
                    "status" => "error",
                    "message" => "Only PDF allowed"
                ]);
                exit;
            }
        } else {
            $message = "No changes submitted.";
        }
    }

    echo json_encode([
        "status" => $status,
        "message" => $message
    ]);
} else {
    echo json_encode([
        "status" => $status,
        "message" => "error occured"
    ]);
}
