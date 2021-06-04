import React from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Link,
} from "react-router-dom";

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
        console.log(response.data);
        if (!response.data) {
          return;
        }
        this.state.user = response.data;
      })
      .catch((e) => {
        console.log(e);
      });
  }

  removeFavorite(movie) {
    //
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

  render() {
    const { movies, user } = this.state;

    const navigation = (
      <Navbar
        bg="secondary"
        expand="lg"
        variant="dark"
        expand="lg"
        className="navbar shadow-sm"
      >
        <Container>
          <Navbar.Brand href="http://localhost:1234" className="navbar-brand">
            animeFlix
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            className="justify-content-end"
            id="basic-navbar-nav"
          >
            <ul>
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
            </ul>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );

    const login = <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />;

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
                  onSaveClick={(movie) => this.addFavorite(movie)}
                />
              </Col>
            ));

            return (
              <div>
                {navigation}
                <Container>
                  <Row>{cards}</Row>
                </Container>
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
                <Col md={4}>
                  <MovieView
                    movie={movies.find((m) => m._id === match.params.movieId)}
                    onBackClick={() => history.goBack()}
                  />
                </Col>
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
              <Col>
                <RegistrationView />
              </Col>
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
              <Col md={6}>
                <GenreView
                  genre={
                    movies.find((m) => m.Genre.Name === match.params.name).Genre
                  }
                  onBackClick={() => history.goBack()}
                />
              </Col>
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
              <Col md={6}>
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
                    favMovies={[]}
                    onBackClick={() => history.goBack()}
                    onSaveClick={(user) => this.updateUser(user)}
                    onDeleteClick={(username) => this.deleteUser(username)}
                  />
                </Container>
              </div>
            );
          }}
        />
      </Router>
    );
  }
}

export default MainView;
