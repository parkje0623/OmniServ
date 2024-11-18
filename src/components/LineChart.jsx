import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, PointElement, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend } from 'chart.js';
// Register necessary Chart.js components
ChartJS.register(CategoryScale, PointElement, LinearScale, LineElement, Title, Tooltip, Legend);

function LineChart({ dataset }) {
    const data = {
        labels: Object.keys(dataset),
        datasets: [
            {
                data: Object.values(dataset).map(item => item.value),
                fill: false,
                borderColor: "#055C9D"
            }
        ]
    };

    const defaultOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Total Time Spent Between Age Groups'
            },
            datalabels: {
                display: false
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Age Groups'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Time Spent (H)'
                }
            }
        }
    };

    return <Line data={data} options={defaultOptions} />
}

export default LineChart;