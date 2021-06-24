import React from "react";
import PropTypes from "prop-types";
import { Card } from "react-bootstrap";
import Button from "react-bootstrap/Button";

import "./genre-view.scss";

export class GenreView extends React.Component {
  render() {
    const { genre, onBackClick } = this.props;

    return (
      <div className="genre-view">
        <div className="genre-card">
          <Card.Body>
            <Card.Title>
              <span>Name:&nbsp;&nbsp; </span> {genre.Name}
            </Card.Title>
            <Card.Text>
              <span>Bio:&nbsp;&nbsp; </span>
              {genre.Description}
            </Card.Text>
            <Button
              className="button"
              onClick={() => {
                onBackClick();
              }}
            >
              Back
            </Button>
          </Card.Body>
        </div>
      </div>
    );
  }
}

GenreView.propTypes = {
  genre: PropTypes.shape({
    Name: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
  }),
  onBackClick: PropTypes.func.isRequired,
};
