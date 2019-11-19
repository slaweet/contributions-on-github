import 'chartjs-plugin-colorschemes';

import { Bar } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

import { formatDate } from './utils';

function aggregateByUserLogin(events) {
  return events.reduce((accumulator, event) => ({
    ...accumulator,
    [event.user.login]: [
      ...(accumulator[event.user.login] || []),
      event,
    ],
  }), {});
}

function aggregateByDay(data, days) {
  const dataByDay = data.reduce((accumulator, event) => ({
    ...accumulator,
    [moment(event.date).startOf('day')]: (accumulator[moment(event.date).startOf('day')] || 0) + 1,
  }), {});

  return days.map((day) => ({ x: day, y: dataByDay[day] || 0 }));
}

function generateDays({ since, until }) {
  const length = moment(until).diff(since, 'days') + 1;
  const days = [...(new Array(length))].map((_, i) => moment(since).startOf('day').add(i, 'days'));
  return days;
}

export default function PerDayChart({ events, config }) {
  const data = () => {
    const days = generateDays(config);
    const chartData = {
      datasets: Object.entries(aggregateByUserLogin(events))
        .map(([label, _data]) => ({
          data: aggregateByDay(_data, days),
          label,
        }))
        .sort((a, b) => ((a.label > b.label) ? 1 : -1)),
    };
    chartData.labels = days.map(formatDate);
    return chartData;
  };

  const options = {
    maintainAspectRatio: false,
  };

  return (
    <>
      <div style={{ height: 300 }}>
        <Bar data={data} options={options} />
      </div>
    </>
  );
}

PerDayChart.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  config: PropTypes.shape().isRequired,
};
