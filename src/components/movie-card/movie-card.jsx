import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import "./movie-card.scss";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

export function MovieCard(props) {
  const movie = props.movie;

  const handleSubmit = (e) => {
    e.preventDefault();
    props.onSaveClick(movie);
  };

  return (
    <Card className="mt-4 cardStyle">
      <Card.Img variant="top" src={movie.ImagePath} />
      <Card.Body>
        <Card.Title>{movie.Title}</Card.Title>
        <Link to={`/movies/${movie._id}`}>
          <Button variant="link">Open</Button>
        </Link>

        <Button type="button" onClick={handleSubmit}>
          Save to favorite
        </Button>
      </Card.Body>
    </Card>
  );
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    ImagePath: PropTypes.string.isRequired,
  }).isRequired,
  onSaveClick: PropTypes.func.isRequired,
};
