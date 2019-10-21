import './App.css';

import { Col, Container, Row } from 'reactstrap';
import { BrowserRouter as Router } from 'react-router-dom';
import React from 'react';

import CommitsPage from './CommitsPage';

function App() {
  return (
    <Router>
      <Container>
        <Row>
          <Col>
            <CommitsPage />
          </Col>
        </Row>
      </Container>
    </Router>
  );
}

export default App;
