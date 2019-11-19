import PropTypes from 'prop-types';
import React from 'react';

import PerDayChart from './PerDayChart';
import PunchChart from './PunchChart';

export default function Charts({ events, config }) {
  return (
    <>
      <PunchChart events={events} config={config} />
      <PerDayChart events={events} config={config} />
    </>
  );
}

Charts.propTypes = {
  config: PropTypes.shape().isRequired,
  events: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};
