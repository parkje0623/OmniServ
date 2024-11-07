import React from "react";
import { Radar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Filler, Tooltip, Legend } from 'chart.js';
// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler);

function RadarChart({ dataset }) {
    const interestsData = {
        labels: ['18-25', '26-35', '36-45', '46-55', '56-65'], 
        datasets: [
            {
                label: 'Sports',
                data: dataset.Sports,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
            {
                label: 'Travel',
                data: dataset.Travel,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
            {
                label: 'Lifestyle',
                data: dataset.Lifestyle,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }
        ]
    };

    // Chart options
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => `${tooltipItem.dataset.label}: ${tooltipItem.raw} Hours`
                }
            },
            datalabels: {
                display: false,
            }
        },
        scales: {
            r: {
                angleLines: {
                    display: false
                },
                suggestedMin: 0,
                suggestedMax: 450,
            }
        }
    };

    return <Radar data={interestsData} options={options} />
}

export default RadarChart;