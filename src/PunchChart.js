import 'chartjs-plugin-colorschemes';

import { Bubble } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

const getAvatarSrc = (id) => (
  `https://avatars3.githubusercontent.com/u/${id}?s=20&v=4`
);

const getPointStyle = (id) => {
  const myImage = new Image(20, 20);
  myImage.src = getAvatarSrc(id);
  return myImage;
};

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
              r: commit.comment_count + 5,
              commit,
            },
          ],
          label: commit.author.login,
          id: commit.author.id,
        },
      }), {})).map(({ id, ...dataset }) => ({
        ...dataset,
        ...(config.showAvatarsAsPoints ? { pointStyle: getPointStyle(id) } : {}),
      })),
    };
    return chartData;
  };

  const options = {
    tooltips: {
      callbacks: {
        title(tooltipItem, _data) {
          return _data.labels[tooltipItem[0].index];
        },
        label(tooltipItem, _data) {
          return _data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].commit.message;
        },
      },
    },
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
              <img src={getAvatarSrc(author.id)} alt="avatar" />
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
