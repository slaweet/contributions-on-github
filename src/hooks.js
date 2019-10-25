import { to } from 'await-to-js';
import { useState, useEffect } from 'react';

import { getCommits } from './utils';

// eslint-disable-next-line import/prefer-default-export
export function useCommits({
  username, repo, since, until,
}) {
  const [commits, setCommits] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function transformCommit({
    // eslint-disable-next-line camelcase
    commit, author, sha, html_url, committer,
  }) {
    return {
      author,
      date: commit.author.date,
      message: commit.message,
      messageHeadline: commit.message.split('\n')[0],
      sha,
      comment_count: commit.comment_count,
      html_url,
      committer,
    };
  }

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
