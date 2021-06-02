import React, { useState } from "react";
import "./registration-view.scss";
import PropTypes from "prop-types";
import axios from "axios";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

export function RegistrationView(props) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthdate, setBirthdate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("https://anime-flix-db.herokuapp.com/users", {
        Username: username,
        Password: password,
        ConfirmPassword: confirmPassword,
        Email: email,
        Birthdate: birthdate,
      })
      .then((response) => {
        const data = response.data;
        console.log(data);
        window.open("/", "_self"); // the second argument '_self' is necessary so that the page will open in the current tab
      })
      .catch((e) => {
        console.log("error registering the user");
      });
  };

  return (
    <div className="loginView">
      <Container>
        <div className="centerVertical"></div>
        <div className="loginScreen">
          <h1>Registration</h1>
          <Form>
            <Form.Group controlId="formUsername">
              <Form.Label>Username:</Form.Label>
              <Form.Control
                type="text"
                value={username}
                placeholder="Enter Username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="email"
                value={email}
                placeholder="Enter your Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                value={password}
                placeholder="Enter Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="confirmformPassword">
              <Form.Label>Confirm Password:</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                placeholder="Enter Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBirthdate">
              <Form.Label>Birthdate:</Form.Label>
              <Form.Control
                type="date"
                placeholder="MM/DD/YYYY"
                onChange={(e) => setBirthdate(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit" onClick={handleSubmit}>
              Submit
            </Button>
          </Form>
        </div>
      </Container>
    </div>
  );
}

RegistrationView.propTypes = {
  register: PropTypes.shape({
    Username: PropTypes.string.isRequired,
    Password: PropTypes.string.isRequired,
    Email: PropTypes.string.isRequired,
    Birthdate: PropTypes.string.isRequired,
  }),
};
