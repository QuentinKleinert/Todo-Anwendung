<?php
    require_once __DIR__ . "/../config/Database.php";
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    class Todo {
        private $db;

        public static function getTasks($name): array {
            $db = new Database();
            $conn = $db->getConnection();

            $query = "SELECT id, title, text, completed FROM todos WHERE user_name = :name";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':name', $name, PDO::PARAM_STR);
            $stmt->execute();
            $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $tasks;
        }

        public static function updateTasks($name, $todos) {
            $db = new Database();
            $conn = $db->getConnection();

            try {
                $conn->beginTransaction();

                $query_delete = "DELETE FROM todos WHERE user_name = :name";
                $stmt = $conn->prepare($query_delete);
                $stmt->bindParam(':name', $name, PDO::PARAM_STR);
                $stmt->execute();

                if (!empty($todos)) {
                    $query_insert = "INSERT INTO todos (user_name, title, text, completed) VALUES (:name, :title, :text, :completed)";
                    $stmt = $conn->prepare($query_insert);

                    foreach ($todos as $task) {
                        $stmt->bindParam(':name', $name, PDO::PARAM_STR);
                        $stmt->bindParam(':title', $task['title'], PDO::PARAM_STR);
                        $stmt->bindParam(':text', $task['text'], PDO::PARAM_STR);
                        $stmt->bindParam(':completed', $task['completed'], PDO::PARAM_INT);
                        $stmt->execute();
                    }
                }

                $conn->commit();
                return true;

            } catch (Exception $e) {
                $conn->rollBack();
                error_log("Fehler beim Update: " . $e->getMessage());
                return false;
            }
        }
    }
?>