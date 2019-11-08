import axios from 'axios';
import moment from 'moment';

export const formatDate = (date) => moment(date).format('YYYY-MM-DD');

export const formatDateAndTime = (date) => moment(date).format('YYYY-MM-DD HH:mm');

const githubToken = localStorage.getItem('githubToken');

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

export const getCommits = async ({
  username, repo, page, since, until,
}) => {
  const response = await axios.get(
    `https://api.github.com/repos/${username}/${repo}/commits`, {
      params: { page, since, until },
      headers: {
        ...(githubToken && { Authorization: `Bearer ${githubToken}` }),
      },
    },
  );
  response.data = response.data.map(transformCommit);
  return response;
};

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

export const getPullRequests = async ({
  username, repo, page, since, until,
}) => {
  const response = await axios.get(
    `https://api.github.com/repos/${username}/${repo}/pulls`, {
      params: { page, state: 'closed' },
      headers: {
        ...(githubToken && { Authorization: `Bearer ${githubToken}` }),
      },
    },
  );
  response.data = response.data.map(transformPullRequest).filter((pr) => (
    (moment(pr.date).isAfter(since))
    && moment(pr.date).isBefore(until)
  ));
  return response;
};
