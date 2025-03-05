<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json; charset=UTF-8");
    require_once __DIR__ . "/../config/Database.php";
    require_once __DIR__ . "/../Models/User.php";

    class UserLoginController{
        
        public function loginUser() {
            $data = json_decode(file_get_contents("php://input"), true);
                if(!isset($data["name"]) || !isset($data["password"])) {
                echo json_encode(["status" => "error", "message" => "Fehlende Daten"]);
                http_response_code(400);
                return;
            }

            $name = $data["name"];
            $password = $data["password"];
            $res = User::login($name, $password);
            if ($res) {
                echo json_encode(["status" => "success", "message" => "Login erfogreich"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Login fehlgeschlagen."]);
            }

        }
    }
?>