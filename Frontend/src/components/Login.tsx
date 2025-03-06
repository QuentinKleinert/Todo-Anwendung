import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type LoginData = {
    name: string;
    password: string;
};

const Login = () => {
    const { register, handleSubmit } = useForm<LoginData>();
    const [responseMessage, setResponseMessage] = useState("");
    const navigate = useNavigate();

    const onSubmit = async (data: LoginData) => {
        try {
            const response = await fetch("/api/index.php?endpoint=login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const text = await response.text();
            console.log("Response Text:", text);

            try {
                const result = JSON.parse(text);
                if (result.status === "success") {
                    localStorage.setItem("user", result.name);
                    setResponseMessage("Login erfolgreich.");
                    setTimeout(() => {
                        navigate(`/TodoList/${result.name}`);
                    }, 1000);
                } else {
                    setResponseMessage(
                        "Login fehlgeschlagen. Bitte überprüfe deine Eingaben."
                    );
                }
            } catch (jsonError) {
                console.log("JSON Parsing Fehler:", jsonError);
                setResponseMessage("Fehler beim Verarbeiten der Antwort");
            }
        } catch (error) {
            console.error("Fehler:", error);
            setResponseMessage(
                "Login fehlgeschlagen. Bitte versuche es später erneut."
            );
        }
    };

    return (
        <div className="container mt-5">
            <h2>Login</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <label htmlFor="loginname" className="form-label">
                        Name
                    </label>
                    <input
                        id="loginname"
                        type="text"
                        className="form-control"
                        {...register("name")}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="loginpassword" className="form-label">
                        Passwort
                    </label>
                    <input
                        id="loginpassword"
                        type="password"
                        className="form-control"
                        {...register("password")}
                    />
                </div>

                <button type="submit" className="btn btn-primary">
                    Login
                </button>
            </form>
            {responseMessage && (
                <div className="alert mt-3 alert-info">{responseMessage}</div>
            )}
        </div>
    );
};

export default Login;
