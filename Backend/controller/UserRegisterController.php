
<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json; charset=UTF-8");
    require_once __DIR__ . "/../config/Database.php";
    require_once __DIR__ . "/../Models/User.php";
    class UserRegisterController {
        
        public function registerUser() {
            header("Content-Type: application/json");

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
                echo json_encode(["status"=> "error","message"=> "Name bereits vorhanden."]);
            } elseif ($res == -0) {
                echo json_encode(["status"=> "success","message"=> "Erfolgreich registriert."]);
            } else {
                echo json_encode(["status"=> "error","message"=> "Error beim registrieren."]);
            }
        }
    }
    
?>

