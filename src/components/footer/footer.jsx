import React from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import logo from "../../imgs/logo.png";


export function Footer(props) {
    return (
        <div>
        <footer>
          <Container>
            <Row>
              <Col md={6}>
                <div>
                  <div className="footerLogo">
                    <img src={logo} alt="logo" />
                  </div>
                </div>
              </Col>
              <Col md={6}>
                <div className="d-flex flex-row-reverse">
                  <span>2021 <a href="https://github.com/Minatore0712" target="_blank">Minatore0712</a></span>
                </div>
              </Col>
            </Row>
          </Container>
        </footer>
      </div>
    );
}