import { Chart } from "chart.js";

// Stacked Bar Custom Options
export const stackedBarChartOptions = ({ title, xAxis, yAxis }) => {
    return {
        responsive: true,
        plugins: {
            legend: {
                title: {
                    display: true,
                    text: title
                },
                position: 'top',
                labels: {
                    // Removing Duplicate Labels
                    generateLabels: (chart) => {
                        const allLabels = Chart.defaults.plugins.legend.labels.generateLabels(chart);
                        const uniqueLabels = [];
                        const seenLabels = new Set();

                        allLabels.forEach((label) => {
                            if (!seenLabels.has(label.text)) {
                                uniqueLabels.push(label);
                                seenLabels.add(label.text);
                            }
                        });
                        return uniqueLabels;
                    }
                }
            },
            datalabels: {
                display: true,
                color: 'black',
                align: 'start',
                anchor: 'start',
                font: {
                    size: 10
                },
                formatter: (value, context) => {
                    const datasetIndex = context.datasetIndex;
                    // Only Display Title on Top of each Bar
                    if (datasetIndex === 0) {
                        return `Male`;
                    } else if (datasetIndex === 1) {
                        return `Female`;
                    } else if (datasetIndex === 2) {
                        return `Non-binary`;
                    }
                    return null;
                },
            }
        },
        scales: {
            x: {
                stacked: true,
                title: {
                    display: true,
                    text: xAxis
                },
                ticks: {
                    padding: 15
                }
            },
            y: {
                stacked: true,
                title: {
                    display: true,
                    text: yAxis
                },
                grid: {
                    display: false
                }
            }
        }
    };
};

// Top Bar Custom Options
export const topBarChartOptions = ({ title }) => {
    return {
        responsive: true,
        plugins: {
            legend: {
                title: {
                    display: true,
                    text: title
                },
                labels: {
                    filter: () => {
                        return false;
                    }
                }
            },
            datalabels: {
                display: true,
                color: 'black',
                align: 'center',
                anchor: 'center',
                formatter: (value, context) => {
                    // Interest Name of each Bar
                    const interest = context.chart.data.labels[context.dataIndex];
                    return `${interest}: ${value}`;
                },
            }
        },
        indexAxis: 'y', // Flip x-axis and y-axis
        scales: {
            x: {
                title: {
                    display: false
                },
                ticks: {
                    display: false
                },
                grid: {
                    display: false
                }
            },
            y: {
                title: {
                    display: false
                },
                ticks: {
                    display: false
                },
                grid: {
                    display: false
                }
            }
        },
    };
};

// ScatterPlot Chart Custom Options
export const scatterPlotChartOptions = ({ title, xAxis, yAxis }) => {
    return {
        responsive: true,
        maintainAspectRatio: false, // Allows to extend respectively
        plugins: {
            title: {
                display: true,
                text: title
            },
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `($${context.raw.x}, ${context.raw.y} hr)`;
                    }
                }
            },
            datalabels: {
                display: false
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: xAxis
                },
                grid: {
                    display: false
                }
            },
            y: {
                title: {
                    display: true,
                    text: yAxis
                },
                grid: {
                    display: false
                }
            }
        },
    };
};