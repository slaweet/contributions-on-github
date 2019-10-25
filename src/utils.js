import axios from 'axios';
import moment from 'moment';

export const getRepoUrl = ({ username, repo }) => (
  `https://github.com/${username}/${repo}/`
);

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
