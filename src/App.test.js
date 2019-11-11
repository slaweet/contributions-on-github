import { Router } from 'react-router-dom';
import React from 'react';
import axios from 'axios';

import { createMemoryHistory } from 'history';
import { render, act } from '@testing-library/react';

import App from './App';
import apiResponses from '../test/mocks/apiResponses';

function renderWithRouter(
  ui,
  { route = '/', history = createMemoryHistory({ initialEntries: [route] }) } = {},
) {
  return {
    ...render(<Router history={history}>{ui}</Router>),
    history,
  };
}

localStorage.setItem('githubToken', 'SECRET TOKEN');

describe('App', () => {
  const route = '/?repo=lisk-hub&username=LiskHQ&since=2019-09-28&until=2019-11-11';

  it('renders message if config not provided', () => {
    const { container } = renderWithRouter(<App />);
    expect(container.innerHTML).toContain('Missing `repo` and/or `username` param');
  });

  it('renders empty state with 0 commits at first', () => {
    const { container } = renderWithRouter(<App />, { route });
    expect(container.innerHTML).toContain('0 commits');
  });

  it('renders with 2 commits and 1 PR from the api', async () => {
    jest.spyOn(axios, 'get').mockImplementation((url) => Promise.resolve(
      { data: apiResponses[url] },
    ));
    let wrapper;
    await act(async () => {
      wrapper = renderWithRouter(<App />, { route });
    });
    expect(wrapper.container.innerHTML).toContain('2 commits');
    expect(wrapper.container.innerHTML).toContain('1 PRs');
    expect(wrapper.container.innerHTML).toContain('2 review comments');
  });
});
