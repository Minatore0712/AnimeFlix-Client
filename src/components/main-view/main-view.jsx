import React from "react";
import axios from "axios";

import { RegistrationView } from "../registration-view/registration-view";
import { LoginView } from "../login-view/login-view";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";

export class MainView extends React.Component {
  constructor() {
    super();
    this.state = {
      movies: [],
      selectedMovie: null,
      user: null,
      registered: null,
      wantsRegistration: false,
    };
  }

  componentDidMount() {
    axios
      .get("https://anime-flix-db.herokuapp.com/movies")
      .then((response) => {
        this.setState({
          movies: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  setSelectedMovie(newSelectedMovie) {
    this.setState({
      selectedMovie: newSelectedMovie,
    });
  }

  onLoggedIn(user) {
    this.setState({
      user,
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
    const { movies, selectedMovie, user, registered, wantsRegistration } =
      this.state;

    if (!user && !wantsRegistration) {
      return (
        <LoginView
          onLoggedIn={(user) => this.onLoggedIn(user)}
          onRegister={(user) => this.onRegister(user)}
        />
      );
    }

    if (!registered) {
      return (
        <RegistrationView onRegistered={(user) => this.onRegistered(user)} />
      );
    }

    if (movies.length === 0) {
      return <div className="main-view" />;
    }

    return (
      <div className="main-view">
        {selectedMovie ? (
          <MovieView
            movie={selectedMovie}
            onBackClick={(newSelectedMovie) => {
              this.setSelectedMovie(newSelectedMovie);
            }}
          />
        ) : (
          movies.map((movie) => (
            <MovieCard
              key={movie._id}
              movie={movie}
              onMovieClick={(newSelectedMovie) => {
                this.setSelectedMovie(newSelectedMovie);
              }}
            />
          ))
        )}
      </div>
    );
  }
}

export default MainView;
