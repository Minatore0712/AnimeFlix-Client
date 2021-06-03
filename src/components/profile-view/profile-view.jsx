import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import moment from "moment";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import "./profile-view.scss";

export function ProfileView(props) {
  const [username, setUsername] = useState(props.user.Username);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(props.user.Email);
  const [birthday, setBirthday] = useState(props.user.Birthday);

  return (
    <div>
      <h1>Profile</h1>
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

        <Form.Group controlId="formBirthday">
          <Form.Label>Birthday:</Form.Label>
          <Form.Control
            type="date"
            value={moment(birthday).toISOString().substr(0, 10)}
            onChange={(e) => setBirthday(e.target.value)}
          />
        </Form.Group>

        <Button
          onClick={() => {
            props.onBackClick();
          }}
        >
          Back
        </Button>

        <Button
          onClick={() => {
            props.onSaveClick({
              Username: username,
              Password: password,
              Email: email,
              Birthday: birthday,
            });
          }}
        >
          Save
        </Button>

        <Button
          onClick={() => {
            props.onDeleteClick(username);
          }}
        >
          Delete my Account
        </Button>
      </Form>
    </div>
  );
}

ProfileView.propTypes = {
  user: PropTypes.shape({
    Username: PropTypes.string.isRequired,
    Password: PropTypes.string.isRequired,
    Email: PropTypes.string.isRequired,
    Birthday: PropTypes.string.isRequired,
  }),
  onBackClick: PropTypes.func.isRequired,
  onSaveClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
};
