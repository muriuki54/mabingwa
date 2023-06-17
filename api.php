<?php
$env = parse_ini_file(".env");

header("Access-Control-Allow-Origin: *");
header("Content-type: application/json");

require_once "db.php";

function handleData() {
    global $env;
    global $conn;
    if(isset($_GET["action"])) {
        switch($_GET["action"]) {
            case "fetchplayers":
                $stmt = $conn->prepare("SELECT * FROM players ORDER BY won DESC, gf - ga DESC;");
                $stmt->execute();
                $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
                $players = $stmt->fetchAll();
                echo json_encode(array("players" => $players));
                $conn = null;
                break;
            default:
                echo json_encode(array("message" => "No action specified, could not fetch data"));
        }
    }

    if(isset($_POST["newtournament"])) {        
        $stats = json_decode($_POST["newtournament"])->players;
        $adminPassword = json_decode($_POST["newtournament"])->password;

        if($adminPassword !== $env["ADMIN_AUTH"] && $_SERVER["HTTP_HOST"] !== "localhost") {
            http_response_code(401);
            echo json_encode(array("success" => false, "message" => "Invalid admin password", "players" => array()));
            die();
        }

        // Insert to DB
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        // SQL statements
        foreach($stats as $stat) {
            $id = $stat->id;
            if($stat->played == false) { // Update player stats ONLY if they played
                $ga = 0;
                $gf = 0;
                $played = 0;
                $won = 0;
            } else {
                $ga = $stat->ga;
                $gf = $stat->gf;
                $played = 1;
                $won = $stat->won == false ? 0 : 1;
            }
            
            if($_SERVER["HTTP_HOST"] === "localhost") {
                // $sql = "UPDATE players SET ga = 0, gf = 0, played = 0, won = 0 WHERE id = $id";
            }
            
            $sql = "UPDATE players SET ga = ga + $ga, gf = gf + $gf, played = played + $played, won = won + $won WHERE id = $id";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
        }
        

        $conn = null;
        echo json_encode(array("success" => true, "message" => "Tournament stats saved"));
    }
    
}

handleData();