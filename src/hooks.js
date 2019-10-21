import { to } from 'await-to-js';
import { useState, useEffect } from 'react';
import axios from 'axios';

// eslint-disable-next-line import/prefer-default-export
export function useCommits({
  username, repo, since, until,
}) {
  const [commits, setCommits] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const githubToken = localStorage.getItem('githubToken');

  function transformCommit({ commit, author, sha }) {
    return {
      author: { login: author.login, id: author.id },
      date: commit.committer.date,
      message: commit.message,
      sha,
      comment_count: commit.comment_count,
    };
  }

  function validateConfig() {
    const isValid = !!repo && !!username;
    if (!isValid) {
      setError('Missing `repo` and/or `username` URL search param. e.g. `?repo=lisk-hub&username=LiskHQ`');
    }
    return isValid;
  }

  async function fetchUrl(page = 1, prevCommits = []) {
    setLoading(true);
    const [err, response] = await to(axios.get(
      `https://api.github.com/repos/${username}/${repo}/commits`, {
        params: { page, since, until },
        headers: {
          ...(githubToken && { Authorization: `Bearer ${githubToken}` }),
        },
      },
    ));
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      const currentCommits = [
        ...prevCommits,
        ...response.data.map(transformCommit).filter(
          ({ sha }) => !prevCommits.some((c) => c.sha === sha),
        )];
      setCommits(currentCommits);
      if (response.data.length === 30) {
        fetchUrl(page + 1, currentCommits);
      }
    }
  }

  useEffect(() => {
    if (validateConfig()) {
      fetchUrl();
    }
    return function cleanup() {
    };
  }, [username, repo, since, until]);
  return [commits, loading, error];
}
