import React from "react";
import PropTypes from "prop-types";

import { Link } from "react-router-dom";

import { Navbar } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

export function Navigation(props) {
  return (
    <Navbar expand="lg" variant="dark" expand="lg" className="navbar shadow-sm">
      <Container>
        <Navbar.Brand
          href="http://localhost:1234"
          className="navbar-brand nav-logo"
        ></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
          <Link to={`/users/${props.user}`}>
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
              onClick={() => props.onLoggedOut()}
            >
              Logout
            </Button>
          </Link>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

Navigation.propTypes = {
  user: PropTypes.shape({
    Username: PropTypes.string.isRequired,
    Password: PropTypes.string.isRequired,
    Email: PropTypes.string.isRequired,
    Birthday: PropTypes.string.isRequired,
  }),
  onLoggedOut: PropTypes.func.isRequired,
};
