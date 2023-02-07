import { useContext } from "react";
import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./NavBar.scss";

const NavBar = () => {
    const { user, logoutUser } = useContext(AuthContext);

    return (
        <Navbar
            bg="dark"
            className="mb-4">
            <Container>
                <div className="logo">
                    <Link to="/">TeanChat</Link>
                </div>
                {user && (
                    <span className="text-primary">
                        Logged in as <strong>{user.name}</strong>
                    </span>
                )}
                <Nav>
                    <Stack
                        direction="horizontal"
                        gap={3}>
                        {user && (
                            <>
                                <Link
                                    onClick={() => logoutUser()}
                                    to="/login"
                                    className="link-light text-decoration-none">
                                    Logout
                                </Link>
                            </>
                        )}

                        {!user && (
                            <>
                                <Link
                                    to="/login"
                                    className="link-light text-decoration-none">
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="link-light text-decoration-none">
                                    Register
                                </Link>
                            </>
                        )}
                    </Stack>
                </Nav>
            </Container>
        </Navbar>
    );
};

export default NavBar;
