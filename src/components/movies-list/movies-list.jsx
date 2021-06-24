import React from "react";
import Col from "react-bootstrap/Col";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import VisibilityFilterInput from "../visibility-filter-input/visibility-filter-input";
import { MovieCard } from "../movie-card/movie-card";
import { Navigation } from "../navigation/navigation";
import { Container, Row } from "react-bootstrap"
import { Footer } from "../footer/footer";

const mapStateToProps = (state) => {
  const { visibilityFilter } = state;
  return { visibilityFilter };
};

function MoviesList(props) {
  const { movies, visibilityFilter } = props;
  let filteredMovies = movies;

  if (visibilityFilter !== "") {
    filteredMovies = movies.filter((m) =>
      m.Title.toLowerCase().includes(visibilityFilter.toLowerCase())
    );
  }

  if (!movies) return <div className="main-view" />;

  const cards = filteredMovies.map((m) => (
    <Col md={3} key={m._id}>
      <MovieCard
        movie={m}
        isFavorite={props.isFavorite(m)}
        onSaveClick={(m) => props.addFavorite(m)}
        onRemoveClick={(m) => props.removeFavorite(m)}
      />
    </Col>
  ));

  return (
    <div>
      <Navigation user={props.user} onLoggedOut={() => props.onLoggedOut()}/>
      <Container>
        <Row>
          <Col md={12} style={{ margin: "1em" }}>
            <VisibilityFilterInput visibilityFilter={visibilityFilter} />
          </Col>
          {cards}
        </Row>
      </Container>
      <Footer/>
    </div>
  );
}

MoviesList.propTypes = {
  isFavorite: PropTypes.func.isRequired,
  addFavorite: PropTypes.func.isRequired,
  removeFavorite: PropTypes.func.isRequired,
  visibilityFilter: PropTypes.string.isRequired,
  movies: PropTypes.array,
  onLoggedOut: PropTypes.func.isRequired,
  
};

export default connect(mapStateToProps)(MoviesList);
