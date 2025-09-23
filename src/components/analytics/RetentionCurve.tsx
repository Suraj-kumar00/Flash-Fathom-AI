'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function RetentionCurve() {
  const data = {
    labels: ['1st Review', '2nd Review', '3rd Review', '4th Review', '5th Review'],
    datasets: [
      {
        label: 'Retention Rate',
        data: [90, 85, 80, 75, 70],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return <Line data={data} />;
}
