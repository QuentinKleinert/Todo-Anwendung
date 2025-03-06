import Register from "./components/Register";
import Login from "./components/Login";
import TodoList from "./components/TodoList";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const Home = () => {
    return (
        <div className="container mt-5">
            <h2>Willkommen zur Todo Anwendung.</h2>
            <Register />
            <Login />
        </div>
    );
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route
                    path="/TodoList/:username"
                    element={<TodoList />}
                ></Route>
            </Routes>
        </Router>
    );
}

export default App;
