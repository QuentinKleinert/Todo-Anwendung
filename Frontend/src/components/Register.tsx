import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";

const schema = z
    .object({
        name: z
            .string({ required_error: "Es muss ein Name angegeben werden." })
            .min(3, { message: "Name muss mindestens 3 Zeichen lang sein." })
            .max(20, { message: "Name kann maximal 20 Zeichen lang sein." }),
        password: z
            .string({
                required_error: "Es muss ein Passwort angegeben werden.",
            })
            .min(8, {
                message: "Das Passwort muss mindestens 8 Zeichen lang sein.",
            }),
        password_confirmation: z
            .string({ required_error: "Das Passwort muss bestätigt werden." })
            .min(8, {
                message: "Das Passwort muss mindestens 8 Zeichen lang sein.",
            }),
    })
    .refine((values) => values.password === values.password_confirmation, {
        message: "Passwörter stimmen nicht überein.",
        path: ["password_confirmation"], // Fehler direkt bei `password_confirmation` anzeigen
    });

type RegisterData = z.infer<typeof schema>;

const Register = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterData>({ resolver: zodResolver(schema) });

    const [responseMessage, setResponseMessage] = useState("");

    const onSubmit = async (data: RegisterData) => {
        //Senden ans Backend
        try {
            const response = await fetch("/api/index.php?endpoint=register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: data.name,
                    password: data.password,
                }),
            });

            const text = await response.text();
            console.log("Raw Response Text:", text);

            try {
                const result = JSON.parse(text);
                if (result.status === "success") {
                    setResponseMessage(result.message);
                } else {
                    setResponseMessage("Fehler: " + result.message);
                }
            } catch (jsonError) {
                console.log("JSON Parsing Fehler:", jsonError);
                setResponseMessage("Fehler beim Verarbeiten der Antwort");
            }
        } catch (error) {
            console.error("Fehler:", error);
            setResponseMessage("Registrierung fehlgeschlagen");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Registrierung</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                        Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        className={`form-control ${
                            errors.name ? "is-invalid" : ""
                        }`}
                        {...register("name")}
                    />
                    {errors.name && (
                        <div className="invalid-feedback">
                            {errors.name.message}
                        </div>
                    )}
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Passwort
                    </label>
                    <input
                        id="password"
                        type="password"
                        className={`form-control ${
                            errors.password ? "is-invalid" : ""
                        }`}
                        {...register("password")}
                    />
                    {errors.password && (
                        <div className="invalid-feedback">
                            {errors.password.message}
                        </div>
                    )}
                </div>

                <div className="mb-3">
                    <label
                        htmlFor="password_confirmation"
                        className="form-label"
                    >
                        Passwort bestätigen
                    </label>
                    <input
                        id="password_confirmation"
                        type="password"
                        className={`form-control ${
                            errors.password_confirmation ? "is-invalid" : ""
                        }`}
                        {...register("password_confirmation")}
                    />
                    {errors.password_confirmation && (
                        <div className="invalid-feedback">
                            {errors.password_confirmation.message}
                        </div>
                    )}
                </div>

                <button type="submit" className="btn btn-primary">
                    Registrieren
                </button>
            </form>
            {responseMessage && (
                <div className="alert mt-3 alert-info">{responseMessage}</div>
            )}
        </div>
    );
};

export default Register;
