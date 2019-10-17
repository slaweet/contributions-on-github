import 'chartjs-plugin-colorschemes';

import { Bubble } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

export default function PunchChart({ commits, config }) {
  const data = () => {
    const chartData = {
      datasets: Object.values(commits.reduce((accumulator, commit) => ({
        ...accumulator,
        [commit.author.login]: {
          data: [
            ...(accumulator[commit.author.login] || { data: [] }).data,
            {
              x: moment(commit.date).hour() + moment(commit.date).minute() / 60,
              y: moment().diff(moment(commit.date), 'days'),
              r: commit.comment_count + 10,
              message: commit.message,
            },
          ],
          label: commit.author.login,
        },
      }), {})),
    };
    return chartData;
  };

  const options = {
    scales: {
      xAxes: [{
        ticks: { callback: (value) => `${value}:00` },
      }],
    },
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
        options={options}
      />
      <ul>
        {commits.map(({
          sha, message, author, date,
        }) => (
          <li key={sha}>
            <a href={`https://github.com/${config.username}/${config.repo}/commit/${sha}`}>
              {sha.substr(0, 6)}
            </a>
            {' '}
             by
            {' '}
            <a href={`https://github.com/${author.login}`}>
              <img src={`https://avatars3.githubusercontent.com/u/${author.id}?s=20&v=4`} alt="avatar" />
              {` ${author.login}`}
            </a>
            {` ${moment(date)} : ${message}`}
          </li>
        ))}
      </ul>
    </div>
  );
}

PunchChart.propTypes = {
  commits: PropTypes.arrayOf(PropTypes.shape).isRequired,
  config: PropTypes.shape().isRequired,
};
