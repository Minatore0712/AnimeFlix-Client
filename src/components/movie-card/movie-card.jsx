import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import "./movie-card.scss";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import heartempty from "../../imgs/heart-regular.svg";
import heartfull from "../../imgs/heart-solid.svg";

export function MovieCard(props) {
  const movie = props.movie;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (props.isFavorite) {
      // is favorite
      props.onRemoveClick(movie);
    } else {
      // not favorite
      props.onSaveClick(movie);
    }
  };

  let buttonElement;
  if (props.isFavorite) {
    // is favorite
    buttonElement = (
      <img src={heartfull} width="20" type="button" onClick={handleSubmit} />
    );
  } else {
    // not favorite
    buttonElement = (
      <img src={heartempty} width="20" type="button" onClick={handleSubmit} />
    );
  }

  return (
    <Card className="mt-4 cardStyle">
      <Card.Img variant="top" src={movie.ImagePath} />
      <Card.Body>
        <Card.Title>{movie.Title}</Card.Title>
        <Link to={`/movies/${movie._id}`}>
          <Button variant="link">Open</Button>
        </Link>
        {buttonElement}
      </Card.Body>
    </Card>
  );
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    ImagePath: PropTypes.string.isRequired,
  }).isRequired,
  isFavorite: PropTypes.bool.isRequired,
  onSaveClick: PropTypes.func.isRequired,
  onRemoveClick: PropTypes.func.isRequired,
};
