<?php
    error_reporting(E_ALL);
    ini_set("display_errors",1);
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json; charset=UTF-8");

    require_once __DIR__ . "/../config/Database.php";
    require_once __DIR__ . "/../Models/Todo.php";

    class UpdateTodosController {
        
        public function updateTodos() {#
            ob_clean();
            $data = json_decode(file_get_contents("php://input"), true);


            if ($data === null) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "Ungültige JSON-Daten"]);
                exit;
            }

            if (!isset($data["name"]) || !isset($data["todos"])) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "Fehlende Daten"]);
                return;
            }

            $name = $data["name"];
            $todos = $data["todos"];

            $result = Todo::updateTasks($name, $todos);

            if ($result) {
                http_response_code(200);
                echo json_encode(["status" => "success", "message" => "Todos erfolgreich aktualisiert"]);
                exit;
            } else {
                http_response_code(500);
                echo json_encode(["status" => "error", "message" => "Fehler beim Aktualisieren der Todos"]);
                exit;
            }
        }
    }
?>
