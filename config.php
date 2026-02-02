<?php
$host = "sql211.infinityfree.com";
$user = "if0_40896855";
$pass = "GNRY5mEIYzK";
$db   = "if0_40896855_interior_design";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("DB Connection Failed: " . $conn->connect_error);
}
?>
