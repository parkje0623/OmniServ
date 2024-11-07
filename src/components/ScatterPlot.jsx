import React from "react";
import { Scatter } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

function ScatterPlot({ data, options }) {
    // Default Option for ScatterPlot
    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false, // Allows to extend respectively
        plugins: {
            title: {
                display: true,
                text: "Scatter Plot Chart"
            },
            legend: {
                display: true
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `($${context.raw.x}, ${context.raw.y} hr)`;
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'X Axis Label'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Y Axis Label'
                }
            }
        }
    };

    return <Scatter data={data} options={{ ...defaultOptions, ...options }} />
}

export default ScatterPlot;