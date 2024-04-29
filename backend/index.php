<?php

declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;
 
require 'vendor/autoload.php';

spl_autoload_register(function($class){
    require __DIR__."/Classes/$class.php";
});


set_exception_handler("CustomExceptionHandler::handleException");
set_error_handler("CustomExceptionHandler::handleError");

session_start();

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PATCH, PUT");         

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
} else {
    header("Content-type:application/json; charset=UTF-8");
    $parts = explode("/", $_SERVER['REQUEST_URI']);
    $database = new Database("localhost", "eventdb","root","");
    $mail = new PHPMailer(true);
    
    $eventRepository = new EventRepository($database);
    $authRepository = new AuthRepository($database);
    $mailService = new MailService($mail);
    $eventController = new EventController($eventRepository,$authRepository,$mailService);

   
 
    $authController = new AuthController($authRepository,$mailService);

    if ($parts[4] == "events"){
        $id = $parts[5] ?? null; 
        $eventController->processRequest($_SERVER["REQUEST_METHOD"],$id);
    }elseif ($parts[4] == "auth") {
        $authController->processRequest($_SERVER["REQUEST_METHOD"], $parts[5]);
    }else{
        http_response_code(404);
        exit;
    }
}

