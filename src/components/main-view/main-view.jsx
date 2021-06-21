import React from "react";
import axios from "axios";

import { connect } from "react-redux";

import {
  BrowserRouter as Router,
  Route,
  Redirect,
} from "react-router-dom";

import "./main-view.scss";

import { LoginView } from "../login-view/login-view";
import { MovieView } from "../movie-view/movie-view";
import { GenreView } from "../genre-view/genre-view";
import { DirectorView } from "../director-view/director-view";
import { RegistrationView } from "../registration-view/registration-view";
import { ProfileView } from "../profile-view/profile-view";


import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import { setMovies } from "../../actions/actions";
import MoviesList from "../movies-list/movies-list";
import { Navigation } from "../navigation/navigation";
import { Footer } from "../footer/footer";

class MainView extends React.Component {
  constructor() {
    super();
    this.state = {
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
        this.props.setMovies(response.data);
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

  isFavorite(movie) {
    return (
      !this.state.userData ||
      !this.state.userData.FavoriteMovies ||
      this.state.userData.FavoriteMovies.indexOf(movie._id) >= 0
    );
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

  render() {
    let { movies } = this.props;
    let { user, userData } = this.state;

    const login = (
      <div>
        <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
        <Footer/>
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

            if (movies.length === 0) return <div className="main-view" />;
            return (
              <MoviesList
              isFavorite={(m) => this.isFavorite(m)}
              addFavorite={(m) => this.addFavorite(m)}
              removeFavorite={(m) => this.removeFavorite(m)}
                movies={movies}
                user={userData}
                onLoggedOut={() => this.onLoggedOut()}
              />
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
                <Navigation
                  user={userData}
                  onLoggedOut={() => this.onLoggedOut()}
                />
                <Container>
                  <MovieView
                    movie={movies.find((m) => m._id === match.params.movieId)}
                    onBackClick={() => history.goBack()}
                  />
                </Container>
                <Footer/>
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
                <Footer/>
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
                <Footer/>
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
                <Footer/>
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
                <Navigation
                  user={userData}
                  onLoggedOut={() => this.onLoggedOut()}
                /> 
                <Container>
                  <ProfileView
                    user={this.state.userData}
                    onBackClick={() => history.goBack()}
                    onSaveClick={(user) => this.updateUser(user)}
                    onDeleteClick={(username) => this.deleteUser(username)}
                    movies={this.props.movies}
                    favMovieIds={this.state.userData.FavoriteMovies}
                    onSaveFavoClick={(m) => this.addFavorite(m)}
                    onRemoveFavoClick={(m) => this.removeFavorite(m)}
                  />
                </Container>
                <Footer/>
              </div>
            );
          }}
        />
      </Router>
    );
  }
}

let mapStateToProps = (state) => {
  return { movies: state.movies };
};

export default connect(mapStateToProps, { setMovies })(MainView);
