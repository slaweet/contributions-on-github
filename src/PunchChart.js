import { Bubble } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import React from 'react';

export default function PunchChart({ commits }) {
  const data = () => {
    const config = {
      datasets: Object.values(commits.reduce((accumulator, commit, i) => ({
        ...accumulator,
        [commit.author.login]: {
          data: [
            ...(accumulator[commit.author.login] || { data: [] }).data,
            {
              x: 3 + i,
              y: 2,
              r: commit.comment_count + 1,
            },
          ],
          label: commit.author.login,
        },
      }), {})),
    };
    return config;
  };

  return (
    <div
      style={{
        width: '95vw',
        height: '300px',
      }}
    >
      <Bubble
        data={data}
      />
      <ul>
        {commits.map(({
          sha, message, author, date,
        }) => (
          <li key={sha}>
            <a href={`https://github.com/LiskHQ/lisk-hub/commits/${sha}`}>
              {sha.substr(0, 6)}
            </a>
            {' '}
             by
            {' '}
            <a href={`https://github.com/${author.login}`}>
              <img src={`https://avatars3.githubusercontent.com/u/${author.id}?s=20&v=4`} alt="avatar" />
              {` ${author.login}`}
            </a>
            {` on ${date} : ${message}`}
          </li>
        ))}
      </ul>
    </div>
  );
}

PunchChart.propTypes = {
  commits: PropTypes.arrayOf(PropTypes.shape).isRequired,
};
