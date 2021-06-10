import React from "react";
import PropTypes from "prop-types";
import { Card } from "react-bootstrap";
import Button from "react-bootstrap/Button";

export class DirectorView extends React.Component {
  render() {
    const { director, onBackClick } = this.props;

    return (
      <div className="genre-view">
        <div className="genre-card">
          <Card.Body>
            <Card.Title>
              <span>Name:&nbsp;&nbsp; </span>
              {director.Name}
            </Card.Title>
            <Card.Text>
              <span>Bio:&nbsp;&nbsp; </span>
              {director.Bio}
            </Card.Text>
            <Card.Text>
              <span>Birth:&nbsp;&nbsp; </span>
              {director.Birth}
            </Card.Text>
            <Card.Text>
              <span>Death:&nbsp;&nbsp; </span>
              {director.Death}
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

DirectorView.propTypes = {
  director: PropTypes.shape({
    Name: PropTypes.string.isRequired,
    Bio: PropTypes.string.isRequired,
    Birth: PropTypes.string.isRequired,
    Death: PropTypes.string,
  }),
  onBackClick: PropTypes.func.isRequired,
};
