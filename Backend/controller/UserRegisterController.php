
<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json; charset=UTF-8");
    require_once __DIR__ . "/../config/Database.php";
    require_once __DIR__ . "/../Models/User.php";
    class UserRegisterController {
        
        public function registerUser() {

            ob_clean(); 

            $data = json_decode(file_get_contents("php://input"), true);
                if(!isset($data["name"]) || !isset($data["password"])) {
                echo json_encode(["status" => "error", "message" => "Fehlende Daten"]);
                http_response_code(400);
                return;
            }

            $name = $data["name"];
            $password = $data["password"];

            $res = User::register($name, $password);
            if ($res == -2) {
                http_response_code(409); // Konflikt, Benutzername existiert bereits
                echo json_encode(["status" => "error", "message" => "Name bereits vorhanden."]);
                exit;
            } elseif ($res == 0) {
                http_response_code(201); // Erfolgreich erstellt
                echo json_encode(["status" => "success", "message" => "Erfolgreich registriert."]);
                exit;
            } else {
                http_response_code(500); // Interner Serverfehler
                echo json_encode(["status" => "error", "message" => "Fehler beim Registrieren."]);
                exit;
            }
        }
    }
    
?>

