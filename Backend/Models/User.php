<?php
require_once __DIR__ . "/../config/Database.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");


    class User {
        private $db;
        private $name;
        private $password;

        public function __construct($name, $password) {
            $this->name = $name;
            $this->password = $password;
        }

        public function getName() {
            return $this->name;
        }

        public function getPassword() {
            return $this->password;
        }

        
        public static function register($name, $password) {
            $db = new Database();
            $conn = $db->getConnection();
            //$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

            $query_data = "SELECT * FROM users";
            $stmt_data = $conn->prepare($query_data);
            $stmt_data->execute();
            $users = $stmt_data->fetchAll(PDO::FETCH_ASSOC);
            foreach ($users as $user) {
                if($user["name"] === $name) {
                    return -2;
                }
            }

            $query_insert = "INSERT INTO users (name, password) VALUES (:name, :password)";
            $stmt_insert = $conn->prepare($query_insert);

            $stmt_insert->bindParam(':name', $name);
            $stmt_insert->bindParam(':password', $password);

            try {
                $stmt_insert->execute();
                return 0;
            } catch (PDOException $e) {
                return -1;
            }
            

        }

        public static function login($name, $password){
            $db = new Database();
            $conn = $db->getConnection();

            $query_data = "SELECT * FROM users WHERE name = :name AND password = :password";
            $stmt = $conn->prepare($query_data);
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':password', $password);
            $stmt->execute();
            
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            return $user !== false;
        }

    }
?>