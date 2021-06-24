import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import "./movie-view.scss";

import Button from "react-bootstrap/Button";

export class MovieView extends React.Component {
  render() {
    const { movie, onBackClick } = this.props;

    return (
      <div className="row no-gutter movieView">
        <div className="col-md-6 d-none d-md-flex">
          <img src={movie.ImagePath} />
        </div>

        <div className="col-md-6">
          <h3 className="mt-5 mb-5">{movie.Title}</h3>
          <div className="mb-4">{movie.Description}</div>
          <div>
            <p className="d-inline ">
              Genre:&nbsp;&nbsp;
              <Link to={`/genres/${movie.Genre.Name}`}>{movie.Genre.Name}</Link>
            </p>

            <p className="d-inline pl-5">
              Director: &nbsp;&nbsp;
              <Link to={`/directors/${movie.Director.Name}`}>
                {movie.Director.Name}
              </Link>
            </p>
          </div>

          <Button
            className="mt-3 button"
            onClick={() => {
              onBackClick(null);
            }}
          >
            Back
          </Button>
        </div>
      </div>

      // <Card className="movie-view">
      //   <Card.Img className="mt-4" src={movie.ImagePath} />
      //   <Card.Body>
      //     <Card.Title>{movie.Title}</Card.Title>
      //     <Card.Text>{movie.Description}</Card.Text>
      //     <Button
      //       onClick={() => {
      //         onBackClick(null);
      //       }}
      //     >
      //       Back
      //     </Button>
      //     <Link to={`/genres/${movie.Genre.Name}`}>
      //       <Button className="mb-2" block variant="primary">
      //         Genre
      //       </Button>
      //     </Link>
      //     <Link to={`/directors/${movie.Director.Name}`}>
      //       <Button className="mb-2" block variant="primary">
      //         Director
      //       </Button>
      //     </Link>
      //   </Card.Body>
      // </Card>
    );
  }
}

MovieView.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    ImagePath: PropTypes.string.isRequired,
  }).isRequired,
  onBackClick: PropTypes.func.isRequired,
};
