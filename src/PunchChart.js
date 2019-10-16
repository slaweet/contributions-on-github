import { Chart } from 'react-charts';
import React from 'react';

export default function PunchChart() {
  const data = React.useMemo(
    () => [
      {
        label: 'Series 1',
        data: [[0, 1], [1, 2], [2, 4], [3, 2], [4, 7]],
      },
      {
        label: 'Series 2',
        data: [[0, 3], [1, 1], [2, 5], [3, 6], [4, 4]],
      },
    ],
    [],
  );

  const axes = React.useMemo(
    () => [
      { primary: true, type: 'linear', position: 'bottom' },
      { type: 'linear', position: 'left' },
    ],
    [],
  );

  const series = React.useMemo(
    () => ({
      type: 'bubble',
      showPoints: false,
    }),
    [],
  );

  return (
    <div
      style={{
        width: '400px',
        height: '300px',
      }}
    >
      <Chart
        data={data}
        axes={axes}
        series={series}
        grouping="single"
        tooltip
      />
    </div>
  );
}
