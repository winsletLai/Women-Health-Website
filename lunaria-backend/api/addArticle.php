<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

include("../config/database.php");

$status = "error";
$message = "";
$uploadDir = "../article/";

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $title = $_POST["title"] ?? null;
    $description = $_POST["description"] ?? null;
    $tags_str = '';


    if (!empty($_POST["tags"]) && is_array($_POST["tags"])) {
        $tags_str = implode(", ", $_POST["tags"]);
    } else {
        $tags_str = $_POST["tags"] ?? '';
    }

    $uid = "";
    if (!isset($_SESSION["uid"])) {
        echo json_encode(["status" => $status, "message" => "User not logged in"]);
        exit;
    } else {
        $uid = $_SESSION["uid"];
    }



    if (!empty($title) && !empty($description) && isset($_FILES["file"]) && $_FILES["file"]["error"] === 0) {
        $file = $_FILES["file"];
        $imageFileType = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));
        if ($imageFileType == "jpg" || $imageFileType == "png" || $imageFileType == "jpeg") {
            $imageName = time() . "_" . basename($file["name"]);
            $targetFile = $uploadDir . $imageName;
            move_uploaded_file($file["tmp_name"], $targetFile);

            $stmt = $conn->prepare("INSERT INTO article (title, content, category, UID) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("ssss", $title, $description, $tags_str, $uid);
            if ($stmt->execute()) {
                $aid = $conn->insert_id;
                $sql = "INSERT INTO article_media (AID, url) VALUES (?, ?)";
                $stmt1 = $conn->prepare($sql);
                $stmt1->bind_param("is", $aid, $imageName);
                if ($stmt1->execute()) {
                    $status = "success";
                    $message = "Successful Upload";
                }
            } else {
                $message = "DB Error: " . $stmt->error;
            }
        } else {
            $message = "Only JPG PNG JPEG allowed";
        }
    } else {
        $message = "Title and description can't be empty";
    }
    echo json_encode([
        "status" => $status,
        "message" => $message
    ]);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request"]);
}
