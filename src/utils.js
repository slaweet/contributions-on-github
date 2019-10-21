import moment from 'moment';

export const getRepoUrl = ({ username, repo }) => (
  `https://github.com/${username}/${repo}/`
);

export const getAvatarSrc = (id) => (
  `https://avatars3.githubusercontent.com/u/${id}?s=20&v=4`
);
export const formatDate = (date) => moment(date).format('YYYY-MM-DD');

export const formatDateAndTime = (date) => moment(date).format('YYYY-MM-DD HH:mm');
