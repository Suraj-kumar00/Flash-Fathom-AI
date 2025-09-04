'use client';

import { useEffect, useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { useSearchParams } from 'next/navigation';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

interface ReviewIntervalData {
  interval: number;
  isCorrect: boolean;
}

export function ReviewIntervalEffectiveness() {
  const [data, setData] = useState<ReviewIntervalData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams(searchParams.toString());
        const response = await fetch(`/api/analytics/review-interval-effectiveness?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    };

    fetchData();
  }, [searchParams]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  const chartData = {
      datasets: [
          {
              label: 'Correct',
              data: data.filter(d => d.isCorrect).map(d => ({ x: d.interval, y: 1 })),
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
          },
          {
              label: 'Incorrect',
              data: data.filter(d => !d.isCorrect).map(d => ({ x: d.interval, y: 0 })),
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
          },
      ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Review Interval Effectiveness',
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `Interval: ${context.raw.x.toFixed(2)} days`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
            display: true,
            text: 'Review Interval (days)',
        },
      },
      y: {
        title: {
            display: true,
            text: 'Outcome (1 = Correct, 0 = Incorrect)',
        },
        min: -0.1,
        max: 1.1,
        ticks: {
            stepSize: 1,
        }
      },
    },
  };

  return <Scatter options={chartOptions} data={chartData} />;
}
