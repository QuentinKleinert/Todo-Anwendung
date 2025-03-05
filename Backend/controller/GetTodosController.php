<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json; charset=UTF-8");
    require_once __DIR__ . "/../config/Database.php";
    require_once __DIR__ . "/../Models/Todo.php";
    class GetTodosController {
        
        public function getTasks() {
            $data = json_decode(file_get_contents("php://input"), true);
            
            if (!isset($data["name"])) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "Fehlende Daten"]);
                return;
            }

            $name = $data["name"];
            $tasks = Todo::getTasks($name);

            if (!$tasks) {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Keine Aufgaben gefunden"]);
            } else {
                http_response_code(200);
                echo json_encode(["status" => "success", "tasks" => $tasks], JSON_PRETTY_PRINT);
            }
        }
    }
?>