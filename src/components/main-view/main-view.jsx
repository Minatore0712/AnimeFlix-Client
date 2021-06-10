import React from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Link,
} from "react-router-dom";

import "./main-view.scss";

import { LoginView } from "../login-view/login-view";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { GenreView } from "../genre-view/genre-view";
import { DirectorView } from "../director-view/director-view";
import { RegistrationView } from "../registration-view/registration-view";
import { ProfileView } from "../profile-view/profile-view";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { Navbar } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import logo from "../../imgs/logo.png";

export class MainView extends React.Component {
  constructor() {
    super();
    this.state = {
      movies: [],
      user: null,
      userData: undefined,
    };
  }

  componentDidMount() {
    const accessToken = localStorage.getItem("token");
    if (accessToken !== null) {
      const user = localStorage.getItem("user");
      this.setState({
        user,
      });
      this.getMovies(accessToken);
      this.getUserData(accessToken, user);
    }
  }

  getMovies(token) {
    axios
      .get("https://anime-flix-db.herokuapp.com/movies", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        this.setState({
          movies: response.data,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  getUserData(token, username) {
    axios
      .get("https://anime-flix-db.herokuapp.com/users/" + username, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        this.setState({
          userData: response.data,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  updateUser(user) {
    const token = localStorage.getItem("token");
    axios
      .put(
        "https://anime-flix-db.herokuapp.com/users/" + user.Username,
        {
          Username: user.Username,
          Password: user.Password,
          Email: user.Email,
          Birthday: user.Birthday,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const data = response.data;
        props.onSaveClick(data);
      })
      .catch((e) => {
        console.log("no such user");
      });
  }

  deleteUser(username) {
    const token = localStorage.getItem("token");
    axios
      .delete("https://anime-flix-db.herokuapp.com/users/" + username, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        this.onLoggedOut();
      })
      .catch((e) => {
        console.log(e);
      });
  }

  addFavorite(movie) {
    const token = localStorage.getItem("token");

    const username = this.state.user;
    const movieId = movie._id;

    axios
      .post(
        "https://anime-flix-db.herokuapp.com/users/" +
          username +
          "/Movies/" +
          movieId,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log("response of addFavorite");
        if (!response.data) {
          return;
        }
        this.setState({ userData: response.data });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  removeFavorite(movie) {
    const token = localStorage.getItem("token");

    const username = this.state.user;
    const movieId = movie._id;

    axios
      .delete(
        "https://anime-flix-db.herokuapp.com/users/" +
          username +
          "/Movies/" +
          movieId,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log("removed from favorite");
        if (!response.data) {
          return;
        }
        this.setState({ userData: response.data });
      })
      .catch((e) => {
        console.log(e);
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

  isFavorite(movie) {
    return (
      !this.state.userData ||
      !this.state.userData.FavoriteMovies ||
      this.state.userData.FavoriteMovies.indexOf(movie._id) >= 0
    );
  }

  render() {
    const { movies, user } = this.state;

    const navigation = (
      <Navbar
        expand="lg"
        variant="dark"
        expand="lg"
        className="navbar shadow-sm"
      >
        <Container>
          <Navbar.Brand
            href="http://localhost:1234"
            className="navbar-brand nav-logo"
          ></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            className="justify-content-end"
            id="basic-navbar-nav"
          >
            <Link to={`/users/${user}`}>
              <Button variant="link" className="navbar-link text-light">
                My Account
              </Button>
            </Link>
            <Link to={`/`}>
              <Button variant="link" className="navbar-link text-light">
                Movies
              </Button>
            </Link>
            <Link to={`/`}>
              <Button
                variant="link"
                className="navbar-link text-light"
                onClick={() => this.onLoggedOut()}
              >
                Logout
              </Button>
            </Link>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );

    const footer = (
      <div>
        <footer>
          <Container>
            <Row>
              <Col md={6}>
                <div>
                  <div className="footerLogo">
                    <img src={logo} alt="logo" />
                  </div>
                </div>
              </Col>
              <Col md={6}>
                <div className="d-flex flex-row-reverse">
                  <span>2020 Minatore0712</span>
                </div>
              </Col>
            </Row>
          </Container>
        </footer>
      </div>
    );

    const login = (
      <div>
        <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
        {footer}
      </div>
    );

    return (
      <Router>
        {/* movies */}
        <Route
          exact
          path="/"
          render={() => {
            if (!user) {
              return login;
            }

            const cards = movies.map((m) => (
              <Col md={3} key={m._id}>
                <MovieCard
                  movie={m}
                  isFavorite={this.isFavorite(m)}
                  onSaveClick={(movie) => this.addFavorite(movie)}
                  onRemoveClick={(movie) => this.removeFavorite(movie)}
                />
              </Col>
            ));

            return (
              <div>
                {navigation}
                <Container>
                  <Row>{cards}</Row>
                </Container>
                {footer}
              </div>
            );
          }}
        />

        {/* movieId */}
        <Route
          exact
          path="/movies/:movieId"
          render={({ match, history }) => {
            if (!user) {
              return login;
            }
            return (
              <div>
                {navigation}
                <Container>
                  <MovieView
                    movie={movies.find((m) => m._id === match.params.movieId)}
                    onBackClick={() => history.goBack()}
                  />
                </Container>
                {footer}
              </div>
            );
          }}
        />

        {/* register */}
        <Route
          path="/register"
          render={() => {
            if (user) return <Redirect to="/" />;
            return (
              <div>
                <RegistrationView />
                {footer}
              </div>
            );
          }}
        />

        {/* genre */}
        <Route
          exact
          path="/genres/:name"
          render={({ match, history }) => {
            if (!user) {
              return login;
            }
            if (movies.length === 0) return <div className="main-view" />;
            return (
              <div>
                <Container>
                  <GenreView
                    genre={
                      movies.find((m) => m.Genre.Name === match.params.name)
                        .Genre
                    }
                    onBackClick={() => history.goBack()}
                  />
                </Container>
                {footer}
              </div>
            );
          }}
        />

        {/*director*/}
        <Route
          exact
          path="/directors/:name"
          render={({ match, history }) => {
            if (!user) {
              return login;
            }
            if (movies.length === 0) return <div className="main-view" />;
            return (
              <div>
                <Container>
                  <Col md={6}>
                    <DirectorView
                      director={
                        movies.find(
                          (m) => m.Director.Name === match.params.name
                        ).Director
                      }
                      onBackClick={() => history.goBack()}
                    />
                  </Col>
                </Container>
                {footer}
              </div>
            );
          }}
        />

        {/* profile */}
        <Route
          exact
          path="/users/:username"
          render={({ match, history }) => {
            if (!this.state.user || !this.state.userData) {
              return login;
            }
            return (
              <div>
                {navigation}
                <Container>
                  <ProfileView
                    user={this.state.userData}
                    onBackClick={() => history.goBack()}
                    onSaveClick={(user) => this.updateUser(user)}
                    onDeleteClick={(username) => this.deleteUser(username)}
                    movies={this.state.movies}
                    favMovieIds={this.state.userData.FavoriteMovies}
                    onSaveFavoClick={(m) => this.addFavorite(m)}
                    onRemoveFavoClick={(m) => this.removeFavorite(m)}
                  />
                </Container>
                {footer}
              </div>
            );
          }}
        />
      </Router>
    );
  }
}

export default MainView;
