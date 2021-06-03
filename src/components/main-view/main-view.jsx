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

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { Navbar } from "react-bootstrap";
import Button from "react-bootstrap/Button";

function getMovies(token) {
    axios
        .get("https://anime-flix-db.herokuapp.com/movies", {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
            setMovies(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function onLoggedIn(authData) {
    console.log(authData);
    this.setState({
        user: authData.user.Username,
    });

    localStorage.setItem("token", authData.token);
    localStorage.setItem("user", authData.user.Username);
    getMovies(authData.token);
}

function onLoggedOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.setState({
        user: null,
    });
}

function onRegister() {
    this.setState({
        wantsRegistration: true,
    });
}

export function MainView() {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(undefined);
    const [movies, setMovies] = useState(undefined);

    if (token !== null) {
        setUser(localStorage.getItem("user"));
        setMovies(getMovies(token));
    }

    return (
        <Router>
            <Navbar
                bg="secondary"
                expand="lg"
                variant="dark"
                expand="lg"
                className="navbar shadow-sm"
            >
                <Container>
                    <Navbar.Brand
                        href="http://localhost:1234"
                        className="navbar-brand"
                    >
                        myFlix
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse
                        className="justify-content-end"
                        id="basic-navbar-nav"
                    >
                        <ul>
                            <Link to={`/users/${user}`}>
                                <Button
                                    variant="link"
                                    className="navbar-link text-light"
                                >
                                    My Account
                                </Button>
                            </Link>
                            <Link to={`/`}>
                                <Button
                                    variant="link"
                                    className="navbar-link text-light"
                                >
                                    Movies
                                </Button>
                            </Link>
                            <Link to={`/`}>
                                <Button
                                    variant="link"
                                    className="navbar-link text-light"
                                    onClick={() => onLoggedOut()}
                                >
                                    Logout
                                </Button>
                            </Link>
                        </ul>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* movies */}
            <Route
                exact
                path="/"
                render={() => {
                    if (!user) {
                        return (
                            <Row>
                                <Col>
                                    <LoginView
                                        onLoggedIn={(user) => onLoggedIn(user)}
                                    />
                                </Col>
                            </Row>
                        );
                    }
                    return movies.map((m) => (
                        <Col md={3} key={m._id}>
                            <MovieCard movie={m} />
                        </Col>
                    ));
                }}
            />

            {/* movieId */}
            <Route
                exact
                path="/movies/:movieId"
                render={({ match, history }) => {
                    if (!user) {
                        return (
                            <Row>
                                <Col>
                                    <LoginView
                                        onLoggedIn={(user) => onLoggedIn(user)}
                                    />
                                </Col>
                            </Row>
                        );
                    }
                    return (
                        <Col md={4}>
                            <MovieView
                                movie={movies.find(
                                    (m) => m._id === match.params.movieId
                                )}
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

            {/* genre */}
            <Route
                exact
                path="/genres/:name"
                render={({ match, history }) => {
                    if (!user)
                        return (
                            <Col>
                                <LoginView
                                    onLoggedIn={(user) => onLoggedIn(user)}
                                />
                            </Col>
                        );
                    if (movies.length === 0)
                        return <div className="main-view" />;
                    return (
                        <Col md={6}>
                            <GenreView
                                genre={
                                    movies.find(
                                        (m) =>
                                            m.Genre.Name === match.params.name
                                    ).Genre
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
                    if (!user)
                        return (
                            <Col>
                                <LoginView
                                    onLoggedIn={(user) => onLoggedIn(user)}
                                />
                            </Col>
                        );
                    if (movies.length === 0)
                        return <div className="main-view" />;
                    return (
                        <Col md={8}>
                            <DirectorView
                                director={
                                    movies.find(
                                        (m) =>
                                            m.Director.Name ===
                                            match.params.name
                                    ).Director
                                }
                                onBackClick={() => history.goBack()}
                            />
                        </Col>
                    );
                }}
            />
        </Router>
    );
}
