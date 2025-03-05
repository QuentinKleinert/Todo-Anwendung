import React, { useState } from "react";

const TodoList = () => {
    const [entries, setEntries] = useState<
        { task: string; text: string; completed: boolean }[]
    >([]);
    const [newTask, setNewTask] = useState("");
    const [newText, setNewText] = useState("");

    const addEntry = (event: React.FormEvent) => {
        event.preventDefault(); // Verhindert das Neuladen der Seite

        if (newTask.trim() && newText.trim()) {
            setEntries([
                ...entries,
                { task: newTask, text: newText, completed: false },
            ]);
            setNewTask("");
            setNewText("");
        }
    };

    const toggleCompletion = (index: number) => {
        setEntries(
            entries.map((entry, i) =>
                i === index ? { ...entry, completed: !entry.completed } : entry
            )
        );
    };

    const deleteEntry = (index: number) => {
        setEntries(entries.filter((_, i) => i !== index));
    };

    const saveTasksToBackend = async () => {
        try {
            const payload = {
                name: "Quentin",
                todos: entries,
            };

            console.log("Gesendetes JSON:", JSON.stringify(payload, null, 2));

            const response = await fetch(
                "/api/index.php?endpoint=updateTodos",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            const data = await response.json();
            if (response.ok) {
                alert("Tasks erfolgreich gespeichert!");
            } else {
                alert("Fehler: " + data.message);
            }
        } catch (error) {
            console.error("Fehler beim Speichern:", error);
        }
    };

    return (
        <div className="container mt-5">
            <form onSubmit={addEntry}>
                <div className="mb-3">
                    <label>Hinzufügen einer Task:</label>
                    <input
                        className="form-control"
                        type="text"
                        placeholder="Füge neue Aufgabe hinzu..."
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label>Hinzufügen des Textes:</label>
                    <input
                        className="form-control"
                        type="text"
                        placeholder="Füge einen Text hinzu..."
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Add
                </button>
            </form>
            <ul className="list-group mt-3">
                {entries.map((entry, index) => (
                    <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center"
                    >
                        <span
                            style={{
                                textDecoration: entry.completed
                                    ? "line-through"
                                    : "none",
                            }}
                        >
                            <strong>{entry.task}:</strong> {entry.text}
                        </span>
                        <div className="d-flex align-items-center">
                            <input
                                type="checkbox"
                                className="form-check-input me-2"
                                checked={entry.completed}
                                onChange={() => toggleCompletion(index)}
                            />
                            <span className="me-3">
                                {entry.completed ? "Fertig" : "Offen"}
                            </span>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => deleteEntry(index)}
                            >
                                Löschen
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            <button
                className="btn btn-success mt-3"
                onClick={saveTasksToBackend}
            >
                Todos speichern
            </button>
        </div>
    );
};

export default TodoList;
