import { useContext } from "react";
import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import UserNav from "../UserNav/UserNav";
import "./NavBar.scss";

const NavBar = () => {
    const { user } = useContext(AuthContext);

    return (
        <Navbar
            bg="dark"
            className="mb-4">
            <Container>
                <div className="logo">
                    <Link to="/">TeanChat</Link>
                </div>
                {user && (
                    <span>
                        Logged in as <strong>{user.name}</strong>
                    </span>
                )}
                <Nav>
                    <Stack
                        direction="horizontal"
                        gap={3}>
                        {user && (
                            <>
                                <UserNav />
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
