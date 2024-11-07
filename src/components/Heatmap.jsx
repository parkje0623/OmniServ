import React from "react";
import { Chart as ChartJS, registerables } from 'chart.js';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
import { Chart } from 'react-chartjs-2';

// Register required components and plugins
ChartJS.register(...registerables, MatrixController, MatrixElement);

function Heatmap({ dataset }) {
    const sampleData = {
        datasets: [
            {
                label: 'Time Spent by Location and Demographic',
                data: dataset,
                backgroundColor: (ctx) => {
                    const value = ctx.raw.v;
                    return value > 400
                        ? 'rgba(255, 99, 132, 0.8)' // Higher values: Darker color
                        : value > 300
                        ? 'rgba(54, 162, 235, 0.8)' // Mid-range values: Medium color
                        : 'rgba(75, 192, 192, 0.8)'; // Lower values: Lighter color
                },
                borderWidth: 1,
                width: ({ chart }) => (chart.chartArea || {}).width / 3 - 1, // Cell width
                height: ({ chart }) => (chart.chartArea || {}).height / 5 - 1, // Cell height
                xAxisID: 'x',
                yAxisID: 'y'
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Time Spent by Location and Demographic'
            },
            datalabels: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (ctx) => `Time Spent: ${ctx.raw.v}`
                }
            }
        },
        scales: {
            x: {
                type: 'category',
                labels: ['Urban', 'Sub_Urban', 'Rural'],
                title: {
                    display: true,
                    text: 'Location'
                },
                grid: {
                    display: false
                },
                offset: true
            },
            y: {
                type: 'category',
                labels: ['18-25', '26-35', '36-45', '46-55', '56-65'],
                title: {
                    display: true,
                    text: 'Demographic'
                },
                grid: {
                    display: false
                },
                offset: true
            }
        }
    };
    
    return (
        <Chart type='matrix' data={sampleData} options={options} />
    );
}

export default Heatmap;