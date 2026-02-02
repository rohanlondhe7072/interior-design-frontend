<?php
// show errors (temporary – debugging)
ini_set('display_errors', 1);
error_reporting(E_ALL);

include "config.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $name  = trim($_POST['name']);
    $phone = trim($_POST['phone']);

    if ($name == "" || $phone == "") {
        die("Empty data");
    }

    $stmt = $conn->prepare("INSERT INTO leads (name, phone) VALUES (?, ?)");
    $stmt->bind_param("ss", $name, $phone);

    if ($stmt->execute()) {
        header("Location: thank-you.php");
        exit;
    } else {
        die("Insert failed");
    }
}
?>
