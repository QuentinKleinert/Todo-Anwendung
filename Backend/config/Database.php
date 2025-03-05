<?php
    class Database {
        private $servername = "localhost";
        private $username = "root";
        private $password = "";
        private $conn;

        public function __construct() {
            $this->conn = null;
            try {
                $this->conn = new PDO("mysql:host=$this->servername;dbname=TodoApplication", $this->username, $this->password);
                $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch (PDOException $e) {
                echo "Connection failed: " . $e->getMessage() . $e->getMessage();
            }

        }

        public function getConnection(): PDO {
            return $this->conn;
        }
    }
?> 