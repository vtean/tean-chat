import { useContext } from "react";
import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Register = () => {
    const { registerInfo, updateRegisterInfo, registerUser, registerError, isRegisterLoading } =
        useContext(AuthContext);

    return (
        <>
            <Form onSubmit={registerUser}>
                <Row className="justify-content-center">
                    <Col xs={6}>
                        <Stack gap={3}>
                            <h2>Register</h2>

                            <Form.Control
                                type="text"
                                placeholder="Name"
                                onChange={(e) =>
                                    updateRegisterInfo({ ...registerInfo, name: e.target.value })
                                }
                            />

                            <Form.Control
                                type="email"
                                placeholder="Email"
                                onChange={(e) =>
                                    updateRegisterInfo({ ...registerInfo, email: e.target.value })
                                }
                            />

                            <Form.Control
                                type="password"
                                placeholder="Password"
                                onChange={(e) =>
                                    updateRegisterInfo({
                                        ...registerInfo,
                                        password: e.target.value,
                                    })
                                }
                            />

                            <p>
                                <span className="me-1">Already have an account?</span>
                                <Link to="/login">Login here</Link>
                            </p>

                            <Button
                                variant="primary"
                                type="submit">
                                {isRegisterLoading ? "Loading.." : "Register"}
                            </Button>

                            {registerError?.error && (
                                <Alert variant="danger">
                                    <p>{registerError?.message}</p>
                                </Alert>
                            )}
                        </Stack>
                    </Col>
                </Row>
            </Form>
        </>
    );
};

export default Register;
