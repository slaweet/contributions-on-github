import 'chartjs-plugin-colorschemes';

import { Bubble } from 'react-chartjs-2';
import { UncontrolledAlert } from 'reactstrap';
import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

import { formatDate } from './utils';

/* istanbul ignore next */ // this is just an experimental feature
const getPointStyle = (user) => {
  const myImage = new Image(20, 20);
  myImage.src = user.avatar_url;
  return myImage;
};

export default function PunchChart({ config, events }) {
  const data = () => {
    const chartData = {
      datasets: Object.values(events.reduce((accumulator, event) => ({
        ...accumulator,
        [event.user.login]: {
          data: [
            ...(accumulator[event.user.login] || { data: [] }).data,
            {
              x: moment(event.date).hour() + moment(event.date).minute() / 60,
              y: moment().startOf('day').diff(moment(event.date).startOf('day'), 'days'),
              r: { pr: 10, commit: 5 }[event.type] || 3,
              event,
            },
          ],
          label: event.user.login,
          user: event.user,
        },
      }), {})).map(({ user, ...dataset }) => ({
        ...dataset,
        ...(config.showAvatarsAsPoints ? { pointStyle: getPointStyle(user) } : {}),
      })).sort((a, b) => ((a.label > b.label) ? 1 : -1)),
    };
    return chartData;
  };

  const options = {
    /* istanbul ignore next */ // chart onClick is not a crucial feature
    onClick(e) {
      /* eslint-disable react/no-this-in-sfc */
      // disable eslint because here this is not referring to this component but to chartjs
      const element = this.getElementAtEvent(e)[0];
      if (element) {
        /* eslint-disable-next-line no-underscore-dangle */
        const { event } = this.config.data.datasets[element._datasetIndex].data[element._index];
        window.open(event.html_url, '_blank');
      }
      /* eslint-enable react/no-this-in-sfc */
    },
    tooltips: {
      callbacks: {
        /* istanbul ignore next */ // chart tooltips are not a crucial feature
        title(tooltipItem, _data) {
          return _data.labels[tooltipItem[0].index];
        },
        /* istanbul ignore next */ // chart tooltips are not a crucial feature
        label(tooltipItem, _data) {
          return _data.datasets[tooltipItem.datasetIndex]
            .data[tooltipItem.index].event.messageHeadline;
        },
      },
    },
    scales: {
      xAxes: [{
        ticks: {
          callback: (value) => `${value}:00`,
        },
      }],
      yAxes: [{
        ticks: {
          stepSize: 1,
          callback: (value) => formatDate(moment().subtract(value, 'days')),
          min: moment().startOf('day').diff(moment(config.until).startOf('day'), 'days') - 1,
          max: moment().startOf('day').diff(moment(config.since).startOf('day'), 'days'),
        },
      }],
    },
    maintainAspectRatio: false,
  };

  return (
    <>
      <div style={{ height: 500 }}>
        <Bubble data={data} options={options} />
      </div>
      <UncontrolledAlert color="info">
      Usage Tip: Try clicking usernames or points on the chart.
      </UncontrolledAlert>
    </>
  );
}

PunchChart.propTypes = {
  config: PropTypes.shape().isRequired,
  events: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};
