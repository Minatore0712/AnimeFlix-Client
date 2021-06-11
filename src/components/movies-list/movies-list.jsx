import React from "react";
import Col from "react-bootstrap/Col";
import { connect } from "react-redux";

import VisibilityFilterInput from "../visibility-filter-input/visibility-filter-input";
import { MovieCard } from "../movie-card/movie-card";

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
        isFavorite={this.isFavorite(m)}
        onSaveClick={(movie) => this.addFavorite(movie)}
        onRemoveClick={(movie) => this.removeFavorite(movie)}
      />
    </Col>
  ));

  return (
    <div>
      {navigation}
      <Container>
        <Row>
          <Col md={12} style={{ margin: "1em" }}>
            <VisibilityFilterInput visibilityFilter={visibilityFilter} />
          </Col>
          {cards}
        </Row>
      </Container>
      {footer}
    </div>
  );
}

export default connect(mapStateToProps)(MoviesList);
