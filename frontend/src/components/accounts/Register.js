import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Row, Col } from 'react-bootstrap';
import { NavLink, Navigate } from 'react-router-dom';
import './login.css';
import logo from '../../../static/logo.svg';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../actions/auth';
import { createMessage } from '../../actions/messages';

const Register = () => {
  const dispatch = useDispatch();

  const [state, setState] = useState({
    username: "",
    email: "",
    password: "",
    password2: ""
  });

  const onSubmit = (e) => {
    e.preventDefault();
    const { username, email, password, password2 } = state;
    if (password !== password2) {
      dispatch(createMessage({ passNotMatch: 'Passwords did not match' }));
    } else {
      const newUser = {
        username,
        email,
        password
      };
      dispatch(register(newUser));
    }
  };

  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const { username, email, password, password2 } = state;

  const isAuthenticated = useSelector((state) => (state.auth.isAuthenticated));
  // Redirect if authenticated
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <React.Fragment>
      <div className="auth-wrapper">
        <div className="auth-content">
          <div className="auth-bg">
            <span className="r" />
            <span className="r s" />
            <span className="r s" />
            <span className="r" />
          </div>
          <Card className="borderless">
            <Row className="align-items-center">
              <Col>
                <Card.Body className="text-center">
                  <div className="mb-4">
                    <i className="feather icon-user-plus auth-icon" />
                  </div>
                  <h3 className="mb-4">Register</h3>
                  <form onSubmit={onSubmit}>
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        className="form-control"
                        name="username"
                        placeholder="Username"
                        onChange={onChange}
                        value={username}
                      />
                    </div>
                    <div className="input-group mb-3">
                      <input
                        type="email"
                        className="form-control"
                        name='email'
                        placeholder="Email address"
                        onChange={onChange}
                        value={email}
                      />
                    </div>
                    <div className="input-group mb-3">
                      <input
                        type="password"
                        className="form-control"
                        name='password'
                        placeholder="Password"
                        onChange={onChange}
                        value={password}
                      />
                    </div>
                    <div className="input-group mb-3">
                      <input
                        type="password"
                        className="form-control"
                        name='password2'
                        placeholder="Re-Enter Password"
                        onChange={onChange}
                        value={password2}
                      />
                    </div>
                    <button className="btn btn-light border w-100 d-flex align-items-center justify-content-center my-2">
                      <img
                        src={logo}
                        alt="Google"
                        style={{ width: '20px', marginRight: '10px' }}
                      />
                      Log in with Google
                    </button>
                    <button className="btn btn-primary mb-4" type='submit'>Register</button>
                    <p className="mb-2">
                      Already have an account?{' '}
                      <NavLink to={'/login'} className="f-w-400">
                        Login
                      </NavLink>
                    </p>
                  </form>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Register;
