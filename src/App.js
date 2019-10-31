import { Col, Container, Row } from 'reactstrap';
import { QueryParamProvider } from 'use-query-params';
import { Route } from 'react-router-dom';
import React from 'react';

import CommitsPage from './CommitsPage';

function App() {
  return (
    <QueryParamProvider ReactRouterRoute={Route}>
      <Container fluid>
        <Row>
          <Col xs="12">
            <CommitsPage />
          </Col>
        </Row>
      </Container>
    </QueryParamProvider>
  );
}

export default App;
