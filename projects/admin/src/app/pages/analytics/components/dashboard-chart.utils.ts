import type { ChartOptions } from 'chart.js';

export const chartColors = {
  blue: '#2563eb',
  blueFill: 'rgba(37, 99, 235, 0.12)',
  danger: '#dc2626',
  dangerFill: 'rgba(220, 38, 38, 0.18)',
  grid: 'rgba(82, 82, 82, 0.14)',
  orange: '#ea580c',
  orangeFill: 'rgba(234, 88, 12, 0.14)',
  success: '#16a34a',
  successFill: 'rgba(22, 163, 74, 0.12)',
  text: '#525252',
} as const;

export function dashboardLineChartOptions(
  valueFormatter: (value: number) => string,
): ChartOptions<'line'> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: chartColors.text,
          maxRotation: 0,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: chartColors.grid,
        },
        ticks: {
          color: chartColors.text,
          callback: (value) => valueFormatter(Number(value)),
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          boxWidth: 10,
          color: chartColors.text,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.dataset.label ?? 'Value'}: ${valueFormatter(
              context.parsed.y ?? 0,
            )}`,
        },
      },
    },
  };
}

export function dashboardBarChartOptions(
  valueFormatter: (value: number) => string,
): ChartOptions<'bar'> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: chartColors.text,
          maxRotation: 0,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: chartColors.grid,
        },
        ticks: {
          color: chartColors.text,
          precision: 0,
          callback: (value) => valueFormatter(Number(value)),
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.dataset.label ?? 'Value'}: ${valueFormatter(
              context.parsed.y ?? 0,
            )}`,
        },
      },
    },
  };
}
