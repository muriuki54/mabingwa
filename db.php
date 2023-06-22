<?php

$environment;
// Check if server mode
if($_SERVER["HTTP_HOST"] === "localhost") {
    $environment = "dev";
    // DEVELOPMENT //
    $serverName = $env["DEVELOPMENT__DB_SERVERNAME"];
    $username = $env["DEVELOPMENT__DB_USERNAME"];
    $password = $env["DEVELOPMENT__DB_PASSWORD"];
    $dbname = $env["DEVELOPMENT_DBNAME"];
} else {
    $environment = "prod";
    // LIVE //
    $serverName = $env["LIVE__DB_SERVERNAME"];
    $username = $env["LIVE__DB_USERNAME"];
    $password = $env["LIVE__DB_PASSWORD"];
    $dbname = $env["LIVE_DBNAME"];
}

$conn;

try {
    global $conn;
    global $environment;
    $conn = new PDO("mysql:host=$serverName;dbname=$dbname", $username, $password);
    // Set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // echo json_encode(array("message", "Connected successfully to " . $environment));
    // die();
} catch (PDOException  $e) {
    http_response_code(500);
    echo json_encode(array("message", "Connection failed"));
    logErrorToFile($e->getMessage());
    die();
}