import { Routes, Route, Navigate } from "react-router-dom";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import Navbar from "./components/NavBar/NavBar";
import "./App.scss";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { ChatContextProvider } from "./context/ChatContext";
import { MessagesProvider } from "./context/MessagesContext";
import { ChatsProvider } from "./context/ChatsContext";

function App() {
    const { user } = useContext(AuthContext);

    return (
        <ChatContextProvider user={user}>
            <MessagesProvider>
                <ChatsProvider>
                    <Navbar />
                    <Container>
                        <Routes>
                            <Route
                                path="/"
                                element={user ? <Chat /> : <Login />}
                            />
                            <Route
                                path="/register"
                                element={user ? <Chat /> : <Register />}
                            />
                            <Route
                                path="/login"
                                element={user ? <Chat /> : <Login />}
                            />
                            <Route
                                path="*"
                                element={<Navigate to="/" />}
                            />
                        </Routes>
                    </Container>
                </ChatsProvider>
            </MessagesProvider>
        </ChatContextProvider>
    );
}

export default App;
