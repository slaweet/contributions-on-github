import './App.css';

import { Col, Container, Row } from 'reactstrap';
import { QueryParamProvider } from 'use-query-params';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import React from 'react';

import CommitsPage from './CommitsPage';

function App() {
  return (
    <Router>
      <QueryParamProvider ReactRouterRoute={Route}>
        <Container fluid>
          <Row>
            <Col xs="12">
              <CommitsPage />
            </Col>
          </Row>
        </Container>
      </QueryParamProvider>

    </Router>
  );
}

export default App;
