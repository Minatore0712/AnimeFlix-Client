import React, { useState } from "react";
import "./registration-view.scss";
import PropTypes from "prop-types";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

export function RegistrationView(props) {
  const [initialPassword, setInitialPassword] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username, password);

    const areEqual = initialPassword === password;
    if (areEqual) {
      // Send a request to the server for authentication then call props.onLoggedIn(username)
      props.onRegistered({
        username,
        password,
      });
      return;
    }
    console.log("passwords don't match");
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
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                value={initialPassword}
                onChange={(e) => setInitialPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Repeat Password:</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit" onClick={handleSubmit}>
              Submit
            </Button>
          </Form>
        </div>
      </Container>
    </div>

    // <div>
    //   <h1>Registration</h1>
    //   <form>
    //     <label>
    //       Username:
    //       <input
    //         type="text"
    //         value={username}
    //         onChange={(e) => setUsername(e.target.value)}
    //       />
    //     </label>
    //     <label>
    //       Password:
    //       <input
    //         type="password"
    //         value={initialPassword}
    //         onChange={(e) => setInitialPassword(e.target.value)}
    //       />
    //     </label>
    //     <label>
    //       Repeat Password:
    //       <input
    //         type="password"
    //         value={password}
    //         onChange={(e) => setPassword(e.target.value)}
    //       />
    //     </label>
    //     <button type="submit" onClick={handleSubmit}>
    //       Submit
    //     </button>
    //   </form>
    // </div>
  );
}

RegistrationView.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
  }),
  onRegistered: PropTypes.func.isRequired,
};
