import { to } from 'await-to-js';
import { useQueryParam, StringParam, BooleanParam } from 'use-query-params';
import { useState, useEffect } from 'react';
import moment from 'moment';

import { getCommits, getPullRequests } from './utils';

const formatEndOfDay = (date) => (
  date.endOf('day').toISOString().substr(0, 10)
);

export function useQueryParamConfig() {
  const [repo = ''] = useQueryParam('repo', StringParam);
  const [username = ''] = useQueryParam('username', StringParam);
  const [since = formatEndOfDay(moment().subtract(14, 'days'))] = useQueryParam('since', StringParam);
  const [until = formatEndOfDay(moment())] = useQueryParam('until', StringParam);
  const [showAvatarsAsPoints = false] = useQueryParam('showAvatarsAsPoints', BooleanParam);

  return [{
    username, repo, since, until, showAvatarsAsPoints,
  }];
}

function transformCommit({
  // eslint-disable-next-line camelcase
  commit, author, sha, html_url,
}) {
  return {
    date: commit.author.date,
    message: commit.message,
    messageHeadline: commit.message.split('\n')[0],
    id: sha,
    html_url,
    user: author,
    type: 'commit',
  };
}

export function useCommits({
  username, repo, since, until,
}) {
  const [commits, setCommits] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function validateConfig() {
      const isValid = !!repo && !!username;
      if (!isValid) {
        setError('Missing `repo` and/or `username` param. Please select them in the header dropdown');
      }
      return isValid;
    }

    async function fetchUrl(page = 1, prevCommits = []) {
      setLoading(true);
      const [err, response] = await to(getCommits({
        repo, username, page, since, until,
      }));
      setLoading(false);
      if (err) {
        setError(err);
      } else {
        const currentCommits = [
          ...prevCommits,
          ...response.data.map(transformCommit).filter(
            ({ id }) => !prevCommits.some((c) => c.id === id),
          )];
        setCommits(currentCommits);
        if (response.data.length === 30) {
          fetchUrl(page + 1, currentCommits);
        }
      }
    }
    if (validateConfig()) {
      fetchUrl();
    }
  }, [username, repo, since, until]);
  return [commits, loading, error];
}

function transformPullRequest({
  // eslint-disable-next-line camelcase
  user, number, html_url, created_at, title,
}) {
  return {
    date: created_at,
    message: title,
    messageHeadline: title,
    id: `#${number}`,
    html_url,
    user,
    type: 'pr',
  };
}

export function usePullRequests({
  username, repo, since, until,
}) {
  const [pullRequests, setPRs] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function validateConfig() {
      const isValid = !!repo && !!username;
      if (!isValid) {
        setError('Missing `repo` and/or `username` param. Please select them in the header dropdown');
      }
      return isValid;
    }

    async function fetchUrl(page = 1, prevPullRequests = []) {
      setLoading(true);
      const [err, response] = await to(getPullRequests({
        repo, username, page, since, until,
      }));
      setLoading(false);
      if (err) {
        setError(err);
      } else {
        const currentPullRequests = [
          ...prevPullRequests,
          ...response.data.map(transformPullRequest).filter(
            ({ id }) => !prevPullRequests.some((c) => c.id === id),
          )];
        setPRs(currentPullRequests);
        if (response.data.length === 30) {
          fetchUrl(page + 1, currentPullRequests);
        }
      }
    }
    if (validateConfig()) {
      fetchUrl();
    }
  }, [username, repo, since, until]);
  return [pullRequests, loading, error];
}
