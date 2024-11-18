import React from "react";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, Title, ArcElement, Tooltip, Legend } from 'chart.js';
// Register the necessary components in Chart.js
ChartJS.register(ArcElement, Title, Tooltip, Legend);

function DonutChart({ dataset }) {
    const data = {
        labels: ['YouTube', 'Facebook', 'Instagram'],
        datasets: [
            {
                data: Object.values(dataset),
                backgroundColor: ['#87BB62', '#4394E5', '#F5921B'],
                borderWidth: 1,
                cutout: '50%'
            }
        ]
    };

    const defaultOption = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Total Time Spent on Each Platform'
            },
            legend: {
                position: 'right'
            },
            datalabels: {
                display: true,
                formatter: (value) => {
                    return value.value;
                }
            }
        }
    };

    return <Doughnut data={data} options={defaultOption} />
}

export default DonutChart;