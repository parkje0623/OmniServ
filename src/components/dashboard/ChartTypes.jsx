import React, { useEffect, useState } from 'react';
import Card from "../Card";
import useFetchCSV from '../../hooks/useFetchCSV';
import { groupByAgeGender, calculateKPIData, calculateGenderInterest, calculateIncomePlatformData, calculateLocationDemographic, calculateTimeOnInterest } from '../../utils/math';
import { stackedBarChartOptions, topBarChartOptions, scatterPlotChartOptions } from '../../utils/chartOptions';
import { processAgeGender } from '../../utils/dataProcessing';

import StackedBarChart from "../StackedBarChart";
import Heatmap from '../Heatmap';
import BarChart from '../BarChart';
import ScatterPlot from '../ScatterPlot';
import RadarChart from '../Radar';

function ChartTypes() {
    const { data } = useFetchCSV('/analytics.csv');
    // KPI Data object
    const [kpiData, setKpiData] = useState({
        avgTimeSpent: 0,
        avgIncome: 0,
        debtUsers: 0,
        homeCarOwners: 0
    });
    // Age Group: 18-25, 26-35, 36-45, 46-55, 56-65
    const [ageGenderGroup, setAgeGenderGroup] = useState({
        labels: [],
        datasets: []
    });
    // Top 5 Gender Interests
    const [genderInterest, setGenderInterest] = useState({
        male: { labels: [], datasets: [] },
        female: { labels: [], datasets: [] },
        'non-binary': { labels: [], datasets: [] }
    });
    // Income vs. Platform Data
    const [incomePlatformData, setIncomePlatformData] = useState({
        datasets: []
    });
    // Time Spent by Location and Demographic
    const [locationDemographic, setLocationDemographic] = useState([{}]);
    // Time Spent on Interests by Age Group
    const [timeOnInterest, setTimeOnInterest] = useState({
        Sports: [],
        Travel: [],
        Lifestyle: []
    });

    useEffect(() => {
        if (!data || data.length === 0) {
            return;
        } 

        // Calculate KPI data
        setKpiData(calculateKPIData(data));
        // Calcaulte Age & Gender & Platform Data
        const ageGenderMap = groupByAgeGender(data);
        const processedAgeGender = processAgeGender(ageGenderMap);
        setAgeGenderGroup(processedAgeGender);
        // Calculate Top 3 Gender Interests
        setGenderInterest(calculateGenderInterest(data));
        // Calculate Income Level vs. Platform Data
        setIncomePlatformData({ datasets: calculateIncomePlatformData(data) });
        
        // Calculate Time Spent by Location and Demograhic
        const ageGroups = [
            { min: 17, max: 25, group: '18-25' },
            { min: 25, max: 35, group: '26-35' },
            { min: 35, max: 45, group: '36-45' },
            { min: 45, max: 55, group: '46-55' },
            { min: 55, max: 65, group: '56-65' }
        ];
        const regions = ['Rural', 'Sub_Urban', 'Urban'];
        setLocationDemographic(calculateLocationDemographic(data, ageGroups, regions));
        // Calculate Time Spent on Interests by Age Group
        const interests = ['Sports', 'Travel', 'Lifestyle'];
        setTimeOnInterest(calculateTimeOnInterest(data, ageGroups, interests));
    }, [data]);

    return (
        <>
            <div className="dashboard-data">
                <div className="first-section">
                    <div className="first-section-data">
                        <Card title={'Avg. Time Spent (H)'} value={kpiData.avgTimeSpent} />
                        <Card title={'Avg. Income'} value={kpiData.avgIncome} />
                        <Card title={'Users in Debt (%)'} value={kpiData.debtUsers} />
                        <Card title={'Home or Car Owners (%)'} value={kpiData.homeCarOwners} />
                    </div>
                </div>

                <div className="second-section">
                    <div className="second-section-data data">
                        <StackedBarChart 
                            data={ageGenderGroup} 
                            options={stackedBarChartOptions({
                                title: 'Platform Usage by Age Group & Gender', 
                                xAxis: 'Age Groups', 
                                yAxis: 'Time Spent (H)'
                            })} 
                        />
                    </div>
                </div>

                <div className="third-section">
                    <div className="third-section-data data">
                        <Heatmap dataset={locationDemographic} />
                    </div>

                    <div className="third-section-data data">
                        <RadarChart dataset={timeOnInterest} />
                    </div>
                </div>

                <div className="fourth-section">
                    <div className="fourth-section-data">
                        <div className='fourth-subsection data'>
                            <BarChart 
                                data={genderInterest.male} 
                                options={topBarChartOptions({
                                    title: 'Top 3 Male Interests'
                                })} 
                            />
                        </div>

                        <div className='fourth-subsection data'>
                            <BarChart 
                                data={genderInterest.female} 
                                options={topBarChartOptions({
                                    title: 'Top 3 Female Interests'
                                })} 
                            />
                        </div>

                        <div className='fourth-subsection data'>
                            <BarChart 
                                data={genderInterest['non-binary']} 
                                options={topBarChartOptions({
                                    title: 'Top 3 Non-Binary Interests'
                                })} 
                            />
                        </div>
                    </div>

                    <div className="fourth-section-data">
                        <div className='extended-fourth-section data'>
                            <ScatterPlot 
                                data={incomePlatformData}
                                options={scatterPlotChartOptions({
                                    title: 'Correlation Between Income Level and Media Usage',
                                    xAxis: 'Income ($)',
                                    yAxis: 'Time Spent (H)'
                                })}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ChartTypes;