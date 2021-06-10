import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import moment from "moment";

import { MovieCard } from "../movie-card/movie-card";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import "./profile-view.scss";

function getFavMovies(movies, favMovieIds) {
  if (!movies || !favMovieIds) {
    console.log("user has no favorites yet");
    return;
  }
  const favMovies = [];
  for (const id of favMovieIds) {
    const movie = movies.filter((m) => {
      return m._id === id;
    })[0];
    favMovies.push(movie);
  }
  return favMovies;
}

export function ProfileView(props) {
  const [username, setUsername] = useState(props.user.Username);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(props.user.Email);
  const [birthday, setBirthday] = useState(props.user.Birthday);

  const favMovies = getFavMovies(props.movies, props.favMovieIds);

  let element;
  if (!favMovies || favMovies.length <= 0) {
    element = <div>You don't have any favorites!</div>;
  } else {
    element = favMovies.map((m) => (
      <Col md={3} key={m._id}>
        <MovieCard
          movie={m}
          isFavorite={true}
          onSaveClick={(m) => props.onSaveFavoClick(m)}
          onRemoveClick={(m) => props.onRemoveFavoClick(m)}
        />
      </Col>
    ));
  }

  return (
    <div>
      <h1 className="mt-5 mb-5">Edit Profile</h1>
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
          <Form.Label>New Password:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            placeholder="Enter new Password"
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
          className="button"
          onClick={() => {
            props.onBackClick();
          }}
        >
          Back
        </Button>

        <Button
          className="button ml-3"
          onClick={() => {
            props.onSaveClick({
              Username: username,
              Password: password,
              Email: email,
              Birthday: birthday,
            });
          }}
        >
          Save Changes
        </Button>

        <Button
          className="button ml-3"
          onClick={() => {
            props.onDeleteClick(username);
          }}
        >
          Delete my Account
        </Button>
      </Form>

      <div className="mt-5">
        <h1>Favorite Movies</h1>
        <div>
          <Row>{element}</Row>
        </div>
      </div>
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
  movies: PropTypes.array,
  favMovieIds: PropTypes.array,
  onSaveFavoClick: PropTypes.func.isRequired,
  onRemoveFavoClick: PropTypes.func.isRequired,
};
