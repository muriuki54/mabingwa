<?php
$env = parse_ini_file(".env");
if($_SERVER["HTTP_HOST"] === "localhost") {
    ini_set('track_errors', 1);
}

header("Access-Control-Allow-Origin: *");
header("Content-type: application/json");

require_once "logs.php";
require_once "db.php";

function handleData() {
    global $env;
    global $conn;
    $method = $_SERVER["REQUEST_METHOD"];

    try {
        if(isset($_GET["action"])) {
            switch($_GET["action"]) {
                case "fetchcurrentseason":
                    $stmt = $conn->prepare("SELECT * FROM fifa_season_september_november ORDER BY won DESC, gf - ga DESC;");
                    $stmt->execute();
                    // $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
                    $players = $stmt->fetchAll();
                    echo json_encode(array("players" => $players));
                    $conn = null;
                    break;
                case "fetchseason":
                    $season = $_GET["season"] ?? $_GET["season"];
                    // echo json_encode(array("players" => $players));
                    
                    if($season !== "all_time_stats") {
                        $stmt = $conn->prepare("SELECT * FROM {$season} ORDER BY won DESC, gf - ga DESC;");
                        $stmt->execute();
                        // $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
                        $players = $stmt->fetchAll();
                        echo json_encode(array("players" => $players));
                    } else if($season === "all_time_stats") {
                        $stmt = $conn->prepare("SELECT
                                                    fifa_season_march_july.name,
                                                    (fifa_season_march_july.gf + fifa_season_september_november.gf + pes_season_september_november.gf) AS total_gf,
                                                    (fifa_season_march_july.gf + fifa_season_september_november.gf + pes_season_september_november.gf) AS gf,
                                                    (fifa_season_march_july.ga + fifa_season_september_november.ga + pes_season_september_november.ga) AS total_ga,
                                                    (fifa_season_march_july.ga + fifa_season_september_november.ga + pes_season_september_november.ga) AS ga,
                                                    (fifa_season_march_july.played + fifa_season_september_november.played + pes_season_september_november.played) AS played,
                                                    (fifa_season_march_july.won + fifa_season_september_november.won + pes_season_september_november.won) AS won,
                                                    (fifa_season_march_july.goldenboot + fifa_season_september_november.goldenboot + pes_season_september_november.goldenboot) AS goldenboot
                                                FROM
                                                    fifa_season_march_july
                                                JOIN
                                                    fifa_season_september_november ON fifa_season_march_july.name = fifa_season_september_november.name
                                                JOIN
                                                    pes_season_september_november ON fifa_season_march_july.name = pes_season_september_november.name
                                                ORDER BY won DESC, total_gf - total_ga DESC;");
                        $stmt->execute();
                        // $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
                        $players = $stmt->fetchAll();
                        echo json_encode(array("players" => $players));
                    } else {
                        echo json_encode(array("message" => "error", "players" => []));
                    }
                    $conn = null;                
                    break;
                default:
                    http_response_code(400);
                   switch($method) {
                    case "GET":
                        $params = $_GET;
                        break;
                    case "POST":
                        $params = $_POST;
                        break;
                    default:
                        $params = array();
                   }
                    echo json_encode(array("message" => "Invalid request. Check if for the proper request URL and request method."));
                    logErrorToFile("Invalid " . $method . " request with params: "  . implode($params, ","));
                    die();
            }
        }
    } catch(Exception $e) {
        echo json_encode(array("error" => $e));
    }

    if(isset($_POST["newtournament"])) {        
        $tournament_type = json_decode($_POST["newtournament"])->tournamentType;
        $stats = json_decode($_POST["newtournament"])->players;
        $adminPassword = json_decode($_POST["newtournament"])->password;

        if($adminPassword !== $env["ADMIN_AUTH"]) {
            http_response_code(401);
            echo json_encode(array("success" => false, "message" => "Invalid admin password", "players" => array()));
            logErrorToFile("Invalid login attempt using password: '" . $adminPassword . "' from IP Address: " . $_SERVER["REMOTE_ADDR"]); //Log invalid password attempts
            die();
        }

        // Open log file to append new data
        $new_stats_filepath =  dirname(__FILE__) . DIRECTORY_SEPARATOR . "logs" . DIRECTORY_SEPARATOR. $tournament_type . "__" . date("m-d-Y h-i-sa") . ".csv"; // create the file with the current timstamp as its name
        $new_stats_file = @fopen($new_stats_filepath, "a");

        // if(! $new_stats_file) echo $php_errormsg;
        // Write headers to CSV file
        fputcsv($new_stats_file, array("Name", "GF", "GA", "Played", "Won", "Golden Boot"));

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
                $golden_boot = 0;
            } else {
                $ga = $stat->ga;
                $gf = $stat->gf;
                $played = 1;
                $won = $stat->won == false ? 0 : 1;
                $golden_boot = $stat->goldenBoot == false ? 0: 1;
            }
            
            if($_SERVER["HTTP_HOST"] === "localhost") {
                // $sql = "UPDATE players SET ga = 0, gf = 0, played = 0, won = 0 WHERE id = $id";
            }

            $season = $tournament_type . "_season_september_november";
            
            $sql = "UPDATE {$season} SET ga = ga + $ga, gf = gf + $gf, played = played + $played, won = won + $won, goldenboot = goldenboot + $golden_boot WHERE id = $id";
            $stmt = $conn->prepare($sql);
            $stmt->execute();

            // Write data to CSV file for redudancy
            $statArray = (array)$stat;
            fputcsv($new_stats_file, [$statArray["name"], $statArray["gf"], $statArray["ga"], $statArray["played"] ? "Yes" : "No",  $statArray["won"] ? "Yes" : "No", $statArray["goldenBoot"] ? "Yes" : "No"]);
        }

        // Close stats file
        fclose($new_stats_file);
        

        $conn = null;
        echo json_encode(array("success" => true, "message" => "Tournament stats saved"));
    }
    
}

handleData();