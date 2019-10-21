import 'chartjs-plugin-colorschemes';

import { Bubble } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

import { formatDate, getAvatarSrc } from './utils';

const getPointStyle = (id) => {
  const myImage = new Image(20, 20);
  myImage.src = getAvatarSrc(id);
  return myImage;
};

export default function PunchChart({ config, commits }) {
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
        ticks: {
          stepSize: 1,
          callback: (value) => `${value}:00`,
        },
      }],
      yAxes: [{
        ticks: {
          stepSize: 1,
          callback: (value) => formatDate(moment().subtract(value, 'days')),
        },
      }],
    },
  };

  return <Bubble data={data} options={options} />;
}

PunchChart.propTypes = {
  config: PropTypes.shape().isRequired,
  commits: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};
