import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const TodoList = () => {
    const { username } = useParams<{ username?: string }>();
    const storedUser = localStorage.getItem("user");
    const finalUsername = username || storedUser;
    const [entries, setEntries] = useState<
        {
            title: string;
            text: string;
            completed: boolean;
            isEditing: boolean;
        }[]
    >([]);
    const [newTask, setNewTask] = useState("");
    const [newText, setNewText] = useState("");

    useEffect(() => {
        const fetchTodos = async () => {
            if (!finalUsername) return;

            try {
                const response = await fetch(
                    "/api/index.php?endpoint=getTodos",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ name: finalUsername }),
                    }
                );

                const data = await response.json();
                console.log("Empfangene Todos:", data);

                if (data.status === "success") {
                    setEntries(data.tasks);
                    console.log("Gespeicherte Todos im State:", data.tasks);
                } else {
                    console.warn("Keine Todos gefunden für diesen Benutzer.");
                    setEntries([]);
                }
            } catch (error) {
                console.error("Fehler beim Abrufen der Todos:", error);
            }
        };

        fetchTodos();
    }, [finalUsername]);

    const addEntry = (event: React.FormEvent) => {
        event.preventDefault();

        if (newTask.trim() && newText.trim()) {
            setEntries([
                ...entries,
                {
                    title: newTask,
                    text: newText,
                    completed: false,
                    isEditing: false,
                },
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

    const startEditing = (index: number) => {
        setEntries(
            entries.map((entry, i) =>
                i === index ? { ...entry, isEditing: true } : entry
            )
        );
    };

    const saveEdit = (index: number, newTask: string, newText: string) => {
        setEntries(
            entries.map((entry, i) =>
                i === index
                    ? {
                          ...entry,
                          title: newTask,
                          text: newText,
                          isEditing: false,
                      }
                    : entry
            )
        );
    };

    const moveEntry = (index: number, direction: "up" | "down") => {
        const newEntries = [...entries];

        if (direction === "up" && index > 0) {
            [newEntries[index], newEntries[index - 1]] = [
                newEntries[index - 1],
                newEntries[index],
            ];
        }
        if (direction === "down" && index < newEntries.length - 1) {
            [newEntries[index], newEntries[index + 1]] = [
                newEntries[index + 1],
                newEntries[index],
            ];
        }

        setEntries(newEntries);
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
            <h2>{finalUsername}'s Todo-Liste</h2>
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
                        {entry.isEditing ? (
                            // Bearbeitungsmodus
                            <div className="d-flex flex-column">
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    defaultValue={entry.title}
                                    onChange={(e) =>
                                        (entry.title = e.target.value)
                                    }
                                />
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    defaultValue={entry.text}
                                    onChange={(e) =>
                                        (entry.text = e.target.value)
                                    }
                                />
                                <button
                                    className="btn btn-success btn-sm"
                                    onClick={() =>
                                        saveEdit(index, entry.title, entry.text)
                                    }
                                >
                                    Speichern
                                </button>
                            </div>
                        ) : (
                            // Normalansicht
                            <span
                                style={{
                                    textDecoration: entry.completed
                                        ? "line-through"
                                        : "none",
                                }}
                            >
                                <strong>{entry.title}:</strong> {entry.text}
                            </span>
                        )}

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

                            {!entry.isEditing && (
                                <>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => startEditing(index)}
                                    >
                                        Bearbeiten
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm me-2"
                                        onClick={() => deleteEntry(index)}
                                    >
                                        Löschen
                                    </button>
                                    <button
                                        className="btn btn-secondary btn-sm me-2"
                                        disabled={index === 0}
                                        onClick={() => moveEntry(index, "up")}
                                    >
                                        ↑
                                    </button>
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        disabled={index === entries.length - 1}
                                        onClick={() => moveEntry(index, "down")}
                                    >
                                        ↓
                                    </button>
                                </>
                            )}
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
