SELECT 
    t.id, 
    t.title, 
    t.text, 
    t.completed, 
    COALESCE(GROUP_CONCAT(c.name SEPARATOR " "), '') AS categories
FROM todos t
LEFT JOIN todo_categories tc ON t.id = tc.todo_id
LEFT JOIN categories c ON tc.category_id = c.id
WHERE t.user_name = ":username"
GROUP BY t.id, t.title, t.text, t.completed;
