import axios from 'axios';
import moment from 'moment';

export const formatDate = (date) => moment(date).format('YYYY-MM-DD');

export const formatDateAndTime = (date) => moment(date).format('YYYY-MM-DD HH:mm');

const githubToken = localStorage.getItem('githubToken');

const githubApi = localStorage.getItem('githubApi') || 'https://api.github.com/';

async function getFromGithub(path, { username, repo, ...params }, transformItem) {
  const response = await axios.get(
    `${githubApi}/repos/${username}/${repo}${path}`, {
      params,
      headers: {
        ...(githubToken && { Authorization: `Bearer ${githubToken}` }),
      },
    },
  );
  response.data = response.data.map(transformItem).filter(({ user }) => !!user);
  return response;
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

export const getCommits = (params) => (
  getFromGithub('/commits', params, transformCommit)
);

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

export const getPullRequests = (params) => (
  getFromGithub('/pulls', {
    ...params, state: 'closed',
  }, transformPullRequest)
);

function transformComment({
  // eslint-disable-next-line camelcase
  user, id, html_url, created_at, body,
}) {
  return {
    date: created_at,
    message: body,
    messageHeadline: body.substr(0, 100),
    id: `${id}`,
    html_url,
    user,
    type: 'comment',
  };
}

export const getComments = (params) => (
  getFromGithub('/pulls/comments', params, transformComment)
);
