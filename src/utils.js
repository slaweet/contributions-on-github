import axios from 'axios';
import moment from 'moment';

export const formatDate = (date) => moment(date).format('YYYY-MM-DD');

export const formatDateAndTime = (date) => moment(date).format('YYYY-MM-DD HH:mm');

const githubToken = localStorage.getItem('githubToken');

export const getCommits = ({
  username, repo, page, since, until,
}) => axios.get(
  `https://api.github.com/repos/${username}/${repo}/commits`, {
    params: { page, since, until },
    headers: {
      ...(githubToken && { Authorization: `Bearer ${githubToken}` }),
    },
  },
);

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
  response.data = response.data.filter((pr) => (
    (moment(pr.created_at).isAfter(since))
    && moment(pr.created_at).isBefore(until)
  ));
  return response;
};
