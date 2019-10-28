import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render } from '@testing-library/react';
import React from 'react';

import App from './App';

function renderWithRouter(
  ui,
  { route = '/', history = createMemoryHistory({ initialEntries: [route] }) } = {},
) {
  return {
    ...render(<Router history={history}>{ui}</Router>),
    history,
  };
}

describe('App', () => {
  const route = '/?repo=lisk-hub&username=LiskHQ';

  it('renders empty state with 0 commits at first', () => {
    const { container } = renderWithRouter(<App />, { route });
    expect(container.innerHTML).toContain('0 commits');
  });
});
