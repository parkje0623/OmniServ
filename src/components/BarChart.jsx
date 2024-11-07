import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

function BarChart({ data, options }) {
    const defaultOption = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: 'Stacked Bar Chart'
            }
        },
        scales: {
            x: {

            },
            y: {

            }
        }   
    };

    return <Bar data={data} options={{ ...defaultOption, ...options }} />;
}

export default BarChart;