<?php
    error_reporting(E_ALL);
    ini_set("display_errors",1);
    header("Content-Type: application/json");
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    require_once __DIR__ . "/./controller/UserRegisterController.php";
    require_once __DIR__ . "/./controller/UserLoginController.php";
    require_once __DIR__ . "/controller/GetTodosController.php";
    require_once __DIR__ . "/controller/UpdateTodosController.php";

    if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
        http_response_code(200);
        exit;
    }


    $endpoint = $_GET["endpoint"] ?? "";


    switch ($endpoint) {
        case "register":
            $userController = new UserRegisterController();
            $userController->registerUser();
            break;

        case "login":
            $userController = new UserLoginController();
            $userController->loginUser();
            break;

        case "getTodos":
            $userController = new GetTodosController();
            $userController->getTasks();
            break;

        case "updateTodos";
            $userController = new UpdateTodosController();
            $userController->updateTodos();
            break;
            
        default:
            echo json_encode(["status" => "error", "message" => "Ungültiger API-Endpunkt"]);
            http_response_code(404);
            break;
    }
?>
