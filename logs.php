<?php

function logErrorToFile($errorMessage = "An error occured") {
    $errorLog = dirname(__FILE__) . DIRECTORY_SEPARATOR . "logs" . DIRECTORY_SEPARATOR . "errorlog.txt";
    file_put_contents($errorLog, "DATE: ". date("d-m-Y h:i:sa") . " ERROR: $errorMessage \n", FILE_APPEND);
}