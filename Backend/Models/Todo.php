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
                // Alte Todos löschen
                $query_delete = "DELETE FROM todos WHERE user_name = :name";
                $stmt = $conn->prepare($query_delete);
                $stmt->bindParam(':name', $name, PDO::PARAM_STR);
                $stmt->execute();

                if (!empty($todos)) {
                    $stmt = $conn->prepare("INSERT INTO todos (user_name, title, text, completed) VALUES (:name, :title, :text, :completed)");
                    
                    foreach ($todos as $task) {
                        $stmt->execute([
                            'name'      => $name,  // Hier war ein Fehler: 'username' -> 'name'
                            'title'     => $task['title'],
                            'text'      => $task['text'],
                            'completed' => (int)$task['completed']
                        ]);
                    }
                }
                return true;
            } catch (Exception $e) {
                error_log("Fehler beim Update: " . $e->getMessage());
                return false;
            }
        }


    }
?>