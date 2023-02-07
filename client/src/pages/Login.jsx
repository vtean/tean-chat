import { useContext } from "react";
import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Login = () => {
    const { loginInfo, updateLoginInfo, loginUser, loginError, isLoginLoading } =
        useContext(AuthContext);

    return (
        <>
            <Form onSubmit={loginUser}>
                <Row className="justify-content-center">
                    <Col xs={6}>
                        <Stack gap={3}>
                            <h2>Login</h2>

                            <Form.Control
                                type="email"
                                placeholder="Email"
                                onChange={(e) =>
                                    updateLoginInfo({ ...loginInfo, email: e.target.value })
                                }
                            />

                            <Form.Control
                                type="password"
                                placeholder="Password"
                                onChange={(e) =>
                                    updateLoginInfo({ ...loginInfo, password: e.target.value })
                                }
                            />

                            <p>
                                <span className="me-1">Don't have an account?</span>
                                <Link to="/register">Register here</Link>
                            </p>

                            <Button
                                variant="primary"
                                type="submit">
                                {isLoginLoading ? "Loading..." : "Login"}
                            </Button>

                            {loginError?.error && (
                                <Alert variant="danger">
                                    <p>{loginError.message}</p>
                                </Alert>
                            )}
                        </Stack>
                    </Col>
                </Row>
            </Form>
        </>
    );
};

export default Login;
