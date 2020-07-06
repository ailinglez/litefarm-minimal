import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import './Login.css';
import { signup, login } from './service';

function LoginForm({ updateLoginStatus }) {
    const alertInitialState = { message: '', show: false, type: 'success' };
    const signupDataInitialState = { email: '', password: '', name: undefined };
    let [signupLoginData, updateData] = useState(signupDataInitialState);
    let [showSignUp, modifyView] = useState(false);
    let [alertMessage, changeAlertMessage] = useState(alertInitialState);
    let [validity, updateValidity] = useState([true, true, true]);

    function dataChangeHandler(property) {
        return (event) => {
            updateData({ ...signupLoginData, [property]: event.target.value })
        }
    }

    function emailValidation() {
        return /[^@\s]+@[^@\s]+\.\w+/.test(signupLoginData.email);
    }

    function loginOrSignup() {
        const isValid = [emailValidation(), signupLoginData.password.length > 6, !!signupLoginData.name || !showSignUp];
        if(!isValid.every(e => e)) {
            updateValidity(isValid);
            return;
        }
        updateValidity(isValid);
        const promise = showSignUp ? signup(signupLoginData) : login(signupLoginData);
        promise.then(() => {
            if (showSignUp) {
                changeAlertMessage({ show: true, message: 'You have successfully signed up for lite farm. Go ahead and login! ', type: 'success' })
                gracefullyCloseAlert();
                updateData({...signupDataInitialState});
                modifyView(false)
            } else {
                updateLoginStatus(true);
            }
        }).catch((err) => {
            if (showSignUp) {
                changeAlertMessage({ show: true, message: 'There was something wrong with your signup process. Try again or contact us.', type: 'danger' })
            } else {
                changeAlertMessage({ show: true, message: 'There was a problem login you in, check your credentials and try again.', type: 'danger' })
            }
            gracefullyCloseAlert();
        })
    }

    function enterPressHandle(event){
         event.key === 'Enter' && loginOrSignup();
    }

    function gracefullyCloseAlert() {
        setTimeout(() => {
            changeAlertMessage(alertInitialState);
        }, 4000)
    }

    return (
        <Container>
            <Row>
                <Col md={{ span: 4, offset: 4 }} xs={{ span: 12 }}>
                    <h3>
                        Login to Litefarm
                    </h3>
                </Col>
            </Row>
            <br></br>
            <Row>
                <Col md={{ span: 4, offset: 4 }} xs={{ span: 12 }}>
                    <Form onKeyPress={enterPressHandle}>
                        <Form.Group>
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" value={signupLoginData.email} onChange={dataChangeHandler('email')} placeholder="Enter email" required/>
                        </Form.Group>
                        {
                            !validity[0] &&
                            <div className="invalid-feedback d-block">
                                Please type in a valid email
                            </div>
                        }
                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" value={signupLoginData.password} onChange={dataChangeHandler('password')} placeholder="Password" required/>
                        </Form.Group>
                        {
                            !validity[1] && 
                            <div className="invalid-feedback d-block">
                                Please type a password with more than 6 characters.
                            </div>
                        }
                        {showSignUp && (
                            <Form.Group>
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text"  value={signupLoginData.name} onChange={dataChangeHandler('name')} placeholder="Your name" ></Form.Control>
                            </Form.Group>
                        )}
                        {
                            showSignUp && !validity[2] && 
                            <div className="invalid-feedback d-block">
                                Please type in your name
                            </div>
                        }
                        <Button variant="primary" onClick={() => loginOrSignup()} className="mt-4">
                            {showSignUp ? 'Signup' : 'Login'}
                        </Button>
                    </Form>
                </Col>
            </Row>
            <br></br>
            <Row>
                <Col md={{ span: 4, offset: 4 }} xs={{ span: 12 }} >
                    {
                        !showSignUp &&
                        <small className="fr">Don't have an  account?
                                <Button onClick={() => modifyView(true)} className="no-border" variant="outline-primary">Signup here!</Button>
                        </small>
                    }
                    {
                        showSignUp &&
                        <small>
                            Already Have an account ?
                            <Button onClick={() => modifyView(false)} className="no-border" variant="outline-primary">Login</Button>
                        </small>
                    }
                </Col>
            </Row>
            <br></br>
            <Row>
                <Col md={{ span: 4, offset: 4 }} xs={{ span: 12 }}>
                    {
                        alertMessage.show &&
                        <Alert variant={alertMessage.type}>{alertMessage.message}</Alert>
                    }
                </Col>
            </Row>
        </Container>
    );
}


export default LoginForm;