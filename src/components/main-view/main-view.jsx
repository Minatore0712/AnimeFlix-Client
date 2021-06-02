import React from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

import { LoginView } from "../login-view/login-view";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { RegistrationView } from "../registration-view/registration-view";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

export class MainView extends React.Component {
  constructor() {
    super();
    this.state = {
      movies: [],
      user: null,
    };
  }

  componentDidMount() {
    let accessToken = localStorage.getItem("token");
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem("user"),
      });
      this.getMovies(accessToken);
    }
  }

  getMovies(token) {
    axios
      .get("https://anime-flix-db.herokuapp.com/movies", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // Assign the result to the state
        this.setState({
          movies: response.data,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  onLoggedIn(authData) {
    console.log(authData);
    this.setState({
      user: authData.user.Username,
    });

    localStorage.setItem("token", authData.token);
    localStorage.setItem("user", authData.user.Username);
    this.getMovies(authData.token);
  }

  onLoggedOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.setState({
      user: null,
    });
  }

  onRegister() {
    this.setState({
      wantsRegistration: true,
    });
  }

  onRegistered(user) {
    this.setState({
      registered: user,
      wantsRegistration: false,
    });
  }

  render() {
    const { movies, user } = this.state;

    if (!user) {
      return (
        <Row>
          <Col>
            <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
          </Col>
        </Row>
      );
    }

    if (movies.length === 0) {
      return <div className="main-view" />;
    }

    return (
      <Container>
        <Router>
          {/* movies */}
          <Row>
            <Route
              exact
              path="/"
              render={() => {
                if (!user)
                  return (
                    <Col>
                      <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
                    </Col>
                  );
                return movies.map((m) => (
                  <Col md={3} key={m._id}>
                    <MovieCard movie={m} />
                  </Col>
                ));
              }}
            />
          </Row>

          {/* movieId */}
          <Route
            exact
            path="/movies/:movieId"
            render={({ match, history }) => {
              if (!user)
                return (
                  <Col>
                    <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
                  </Col>
                );
              return (
                <Col md={4}>
                  <MovieView
                    movie={movies.find((m) => m._id === match.params.movieId)}
                    onBackClick={() => history.goBack()}
                  />
                </Col>
              );
            }}
          />

          {/* register */}
          <Route
            path="/register"
            render={() => {
              if (user) return <Redirect to="/" />;
              return (
                <Col>
                  <RegistrationView />
                </Col>
              );
            }}
          />

          {/* user */}
          {/* <Route
            exact
            path="/users/:username"
            render={({ history }) => {
              if (!user)
                return (
                  <Col>
                    <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
                  </Col>
                );
              return (
                <Col md={12}>
                  <ProfileView
                    onLoggedIn={(user) => this.onLoggedIn(user)}
                    movies={movies}
                    user={user}
                    onBackClick={() => history.goBack()}
                  />
                </Col>
              );
            }}
          /> */}

          {/* <Route exact path="/genres/:name" render={}/> */}

          {/* director */}
          {/* <Route
            path="/directors/:name"
            render={({ match, history }) => {
              if (movies.length === 0) return <div className="main-view" />;
              return (
                <Col md={8}>
                  <DirectorView
                    director={
                      movies.find((m) => m.Director.Name === match.params.name)
                        .Director
                    }
                    onBackClick={() => history.goBack()}
                  />
                </Col>
              );
            }}
          />*/}

          {/* genre */}
          {/* <Route
            exact
            path="/genres/:name"
            render={({ match, history }) => {
              return (
                <Col md={6}>
                  <GenreView
                    genre={
                      movies.find((m) => m.Genre.Name === match.params.name)
                        .Genre
                    }
                    onBackClick={() => history.goBack()}
                  />
                </Col>
              );
            }}
          /> */}
        </Router>
      </Container>
    );
  }
}

export default MainView;
